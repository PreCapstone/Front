import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getUserImages } from '../services/imageService';
import { SketchPicker } from 'react-color';
import { uploadImageToS3 } from "../services/imageUploadService";

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  height: 100vh;
  box-sizing: border-box;
`;

const ImageContainer = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    border: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 80%;
  object-fit: contain;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  font-size: 16px;
  color: #888;
`;

const TextOverlay = styled.div`
  position: absolute;
  top: ${({ top }) => (top !== undefined ? top : 0)}px;
  left: ${({ left }) => (left !== undefined ? left : 0)}px;
  cursor: move;
  font-size: ${({ fontSize }) => fontSize || 16}px;
  font-family: ${({ fontFamily }) => fontFamily || 'Arial'};
  color: ${({ color }) => color || 'yellow'};
  user-select: none;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
`;

const StickerOverlayContainer = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width || 60}px;
  height: ${({ height }) => height || 60}px;
  border: ${({ selected }) => (selected ? '2px dashed blue' : 'none')};
  box-sizing: border-box;
  cursor: move;
  z-index: 999;
`;

const StickerOverlay = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TextEditContainer = styled.div`
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  border-left: 1px solid #ddd;
  padding: 15px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-sizing: border-box;
`;

const StyleButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StyleButton = styled.button`
  padding: 5px 10px;
  background-color: ${({ active }) => (active ? '#d3d3d3' : '#f5f5f5')};
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const HistoryPane = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 90%;
  border: 1px solid #ddd;
  box-sizing: border-box;
  width: 300px;
`;

const HistoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const HistoryImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ primary }) => (primary ? '#0066ff' : 'white')};
  color: ${({ primary }) => (primary ? 'white' : 'black')};
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#004bb5' : '#f0f0f0')};
  }
`;

const BottomButton = styled(ActionButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: auto;
  height: 40px;
  background-color: blue;
  color: white;
`;

const StickerSelectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
`;

const StickerPreview = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: 2px solid transparent;
  &:hover {
    border-color: #0066ff;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: blue;
  cursor: ${({ direction }) => `${direction}-resize`};
  ${({ position }) => position};
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const ImageEditingPage = ({
  generatedImage,
  imageHistory = [],
  setImageHistory,
  setActivePage,
  setEditedImage,
  generationTime,
}) => {
  const [showTextEdit, setShowTextEdit] = useState(false);
  const [showStickerEdit, setShowStickerEdit] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [fontSize] = useState(30);
  const [fontFamily] = useState('Malgun Gothic');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(generatedImage);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');

  const fonts = [
    'Malgun Gothic',
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Helvetica',
    'Trebuchet MS',
    'Tahoma',
    'Dotum',
    'Gulim',
  ];

  const imageContainerRef = useRef(null);

  const handleAddText = () => {
    if (textInput.trim()) {
      setTexts([
        ...texts,
        {
          text: textInput,
          top: 50,
          left: 50,
          bold: false,
          italic: false,
          underline: false,
          color: 'black',
          fontSize,
          fontFamily,
        },
      ]);
      setTextInput('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStickers((prevStickers) => {
          const newStickers = [
            ...prevStickers,
            { src: e.target.result, top: 50, left: 50, width: 60, height: 60 },
          ];
          setSelectedStickerIndex(newStickers.length - 1);
          return newStickers;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteClick = async () => {
    if (!selectedImage) {
      alert('선택된 이미지가 없습니다. 이미지를 선택하세요.');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.crossOrigin = 'anonymous';
    img.src = selectedImage;

    img.onload = async () => {
      try {
        const imageContainerRect = imageContainerRef.current.getBoundingClientRect();
        const renderedWidth = imageContainerRect.width;
        const renderedHeight = imageContainerRect.height;

        const aspectRatio = img.width / img.height;

        if (aspectRatio >= 1) {
          canvas.width = renderedWidth;
          canvas.height = renderedWidth / aspectRatio;
        } else {
          canvas.height = renderedHeight;
          canvas.width = renderedHeight * aspectRatio;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        texts.forEach((textObj) => {
          const relativeLeft = (textObj.left / renderedWidth) * canvas.width;
          const relativeTop = (textObj.top / renderedHeight) * canvas.height;
          ctx.font = `${textObj.bold ? 'bold ' : ''}${textObj.italic ? 'italic ' : ''}${textObj.fontSize}px ${textObj.fontFamily}`;
          ctx.fillStyle = textObj.color;
          ctx.fillText(textObj.text, relativeLeft, relativeTop);
        });

        await Promise.all(
          stickers.map(
            (sticker) =>
              new Promise((resolve) => {
                const stickerImg = new window.Image();
                stickerImg.src = sticker.src;
                stickerImg.onload = () => {
                  const relativeLeft = (sticker.left / renderedWidth) * canvas.width;
                  const relativeTop = (sticker.top / renderedHeight) * canvas.height;
                  ctx.drawImage(
                    stickerImg,
                    relativeLeft,
                    relativeTop,
                    (sticker.width / renderedWidth) * canvas.width,
                    (sticker.height / renderedHeight) * canvas.height
                  );
                  resolve();
                };
              })
          )
        );

        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert('이미지 생성에 실패했습니다.');
            return;
          }

          if (blob.type !== 'image/png') {
            alert('이미지 형식은 PNG만 지원됩니다.');
            return;
          }

          const userId = sessionStorage.getItem('userId') || '123';
          const s3Url = await uploadImageToS3(blob, userId);
          setEditedImage(s3Url);
          setActivePage('ImageSendPage');
        }, 'image/png');
      } catch (error) {
        console.error('이미지 처리 중 오류 발생:', error);
        alert('이미지 처리에 실패했습니다.');
      }
    };

    img.onerror = () => {
      alert('이미지를 로드할 수 없습니다. 다시 시도해주세요.');
    };
  };

  const handleStyleChange = (style) => {
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          [style]: !updatedTexts[selectedTextIndex][style],
        };
        return updatedTexts;
      });
    }
  };

  const handleColorChange = (color) => {
    const newColor = color.hex;
    setCurrentColor(newColor);
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          color: newColor,
        };
        return updatedTexts;
      });
    }
  };
  const handleDragStart = (index, type, event) => {
    if (index === null || type === null) return;
  
    event.preventDefault();
    const containerRect = imageContainerRef.current.getBoundingClientRect();
  
    setDraggingIndex({
      index,
      type,
      startX: event.clientX - containerRect.left,
      startY: event.clientY - containerRect.top,
    });
  };
  
  const handleDrag = (event) => {
    if (!draggingIndex) return;

    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const currentX = event.clientX - containerRect.left;
    const currentY = event.clientY - containerRect.top;
    const deltaX = currentX - draggingIndex.startX;
    const deltaY = currentY - draggingIndex.startY;

    if (draggingIndex.type === 'text') {
      setTexts((prevTexts) =>
        prevTexts.map((text, i) =>
          i === draggingIndex.index
            ? {
                ...text,
                left: Math.max(0, text.left + deltaX),
                top: Math.max(0, text.top + deltaY),
              }
            : text
        )
      );
    } else if (draggingIndex.type === 'sticker') {
      setStickers((prevStickers) =>
        prevStickers.map((sticker, i) =>
          i === draggingIndex.index
            ? {
                ...sticker,
                left: Math.max(0, sticker.left + deltaX),
                top: Math.max(0, sticker.top + deltaY),
              }
            : sticker
        )
      );
    }

    setDraggingIndex({
      ...draggingIndex,
      startX: currentX,
      startY: currentY,
    });
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDeleteText = () => {
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => prevTexts.filter((_, index) => index !== selectedTextIndex));
      setSelectedTextIndex(null);
    }
  };

  const handleFontSizeChange = (size) => {
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          fontSize: size,
        };
        return updatedTexts;
      });
    }
  };

  const handleFontFamilyChange = (family) => {
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          fontFamily: family,
        };
        return updatedTexts;
      });
    }
  };

  let sampleStickers = [];
  try {
    const importAll = (r) => r.keys().map(r);
    sampleStickers = importAll(require.context('../assets/stickers', false, /\.(png|jpe?g|svg)$/));
  } catch (error) {
    console.error('Error loading stickers:', error);
    sampleStickers = [];
  }

  const handleAddSampleSticker = useCallback((src) => {
    setStickers((prev) => {
      const newStickers = [
        ...prev,
        { src, top: 50, left: 50, width: 60, height: 60 },
      ];
      setSelectedStickerIndex(newStickers.length - 1);
      return newStickers;
    });
  }, []);

  const handleDeleteSticker = (index) => {
    setStickers((prevStickers) => {
      const updatedStickers = prevStickers.filter((_, i) => i !== index);
      return updatedStickers;
    });

    setSelectedStickerIndex((prevIndex) => {
      if (prevIndex >= index) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  useEffect(() => {
    if (generatedImage) {
      setSelectedImage(generatedImage);
      setImageHistory((prevHistory) => [generatedImage, ...prevHistory]);
    }
  }, [generatedImage]);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
          throw new Error('사용자 ID가 존재하지 않습니다.');
        }
        const userImages = await getUserImages(userId);
        console.log('응답 데이터:', userImages);
        const userImageUrls = userImages.map((image) => image.userImage).reverse();
        setImageHistory(userImageUrls);
      } catch (error) {
        console.error('Error fetching user images in ImageEditingPage:', error);
        alert('사용자 이미지를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [setImageHistory]);

  const handleSelectHistoryImage = (image) => {
    if (!image) {
      alert('유효하지 않은 이미지입니다.');
      return;
    }
    setSelectedImage(image);
  };

  const handleStickerClick = (index, event) => {
    event.stopPropagation();
    if (selectedStickerIndex === index) {
      setSelectedStickerIndex(null);
    } else {
      setSelectedStickerIndex(index);
    }
  };

  const handleStickerResizeStart = useCallback(
    (index, direction, event) => {
      event.stopPropagation();
      event.preventDefault();

      const containerRect = imageContainerRef.current.getBoundingClientRect();

      setDraggingIndex({
        index,
        type: 'resize',
        direction,
        startX: event.clientX - containerRect.left,
        startY: event.clientY - containerRect.top,
        initialWidth: stickers[index].width,
        initialHeight: stickers[index].height,
        initialTop: stickers[index].top,
        initialLeft: stickers[index].left,
      });
    },
    [stickers]
  );

  const handleStickerResize = useCallback(
    (event) => {
      if (!draggingIndex || draggingIndex.type !== 'resize') return;

      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const currentX = event.clientX - containerRect.left;
      const currentY = event.clientY - containerRect.top;

      const {
        index,
        direction,
        startX,
        startY,
        initialWidth,
        initialHeight,
        initialTop,
        initialLeft,
      } = draggingIndex;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      setStickers((prevStickers) =>
        prevStickers.map((sticker, i) => {
          if (i !== index) return sticker;

          let newWidth = initialWidth;
          let newHeight = initialHeight;
          let newLeft = initialLeft;
          let newTop = initialTop;

          if (direction === 'e') {
            newWidth = Math.max(20, initialWidth + deltaX);
          }
          if (direction === 's') {
            newHeight = Math.max(20, initialHeight + deltaY);
          }
          if (direction === 'w') {
            newWidth = Math.max(20, initialWidth - deltaX);
            newLeft = Math.max(initialLeft + deltaX, 0);
          }
          if (direction === 'n') {
            newHeight = Math.max(20, initialHeight - deltaY);
            newTop = Math.max(initialTop + deltaY, 0);
          }

          return {
            ...sticker,
            width: newWidth,
            height: newHeight,
            left: newLeft,
            top: newTop,
          };
        })
      );
    },
    [draggingIndex]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  useEffect(() => {
    if (stickers.length === 0) {
      setSelectedStickerIndex(null);
    } else if (selectedStickerIndex >= stickers.length) {
      setSelectedStickerIndex(stickers.length - 1);
    }
  }, [stickers, selectedStickerIndex]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!draggingIndex) return;
  
      if (draggingIndex.type === 'resize') {
        handleStickerResize(event);
      } else if (
        draggingIndex.type === 'drag' ||
        draggingIndex.type === 'text' ||
        draggingIndex.type === 'sticker'
      ) {
        handleDrag(event);
      }
    };
  
    const handleMouseUpEvent = () => {
      handleMouseUp();
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpEvent);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpEvent);
    };
  }, [draggingIndex, handleStickerResize, handleDrag, handleMouseUp]);
  
  return (
    <PageContainer>
      {showTextEdit && (
        <TextEditContainer>
          <h4>텍스트 입력</h4>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            style={{ width: '100%', height: '80px', marginBottom: '10px' }}
            placeholder="텍스트를 입력하세요"
          />
          <ActionButton onClick={handleAddText}>텍스트 추가</ActionButton>

          {selectedTextIndex !== null && (
            <>
              <StyleButtonsContainer>
                <StyleButton active={texts[selectedTextIndex]?.bold} onClick={() => handleStyleChange('bold')}>
                  굵게
                </StyleButton>
                <StyleButton active={texts[selectedTextIndex]?.italic} onClick={() => handleStyleChange('italic')}>
                  기울임
                </StyleButton>
                <StyleButton active={texts[selectedTextIndex]?.underline} onClick={() => handleStyleChange('underline')}>
                  밑줄
                </StyleButton>
              </StyleButtonsContainer>

              <div style={{ marginTop: '10px' }}>
                <label>글꼴 :</label>
                <select
                  style={{ marginLeft: '20px' }}
                  value={texts[selectedTextIndex]?.fontFamily || fontFamily}
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                >
                  {fonts.map((font, index) => (
                    <option key={index} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '10px' }}>
                <label>텍스트 크기 :</label>
                <input
                  type="number"
                  value={texts[selectedTextIndex]?.fontSize || fontSize}
                  min="10"
                  max="50"
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                  style={{ marginLeft: '20px', width: '50px' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <label>텍스트 색상 :</label>
                <button
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: texts[selectedTextIndex]?.color || '#000000',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    color: '#fff',
                  }}
                  onClick={() => setColorPickerVisible(!colorPickerVisible)}
                >
                  색상 선택
                </button>
              </div>

              {colorPickerVisible && (
                <div style={{ position: 'absolute', zIndex: 2 }}>
                  <SketchPicker color={texts[selectedTextIndex]?.color || currentColor} onChangeComplete={handleColorChange} />
                </div>
              )}

              <ActionButton
                onClick={handleDeleteText}
                style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}
              >
                텍스트 삭제
              </ActionButton>
            </>
          )}
        </TextEditContainer>
      )}

      {showStickerEdit && (
        <TextEditContainer>
          <h4>스티커 추가</h4>
          <input type="file" accept="image/*" onChange={handleFileUpload} style={{ marginTop: '10px' }} />
          <p>샘플 스티커 선택</p>
          <StickerSelectionContainer>
            {sampleStickers.map((sticker, index) => (
              <StickerPreview key={index} src={sticker} alt={`샘플 스티커 ${index}`} onClick={() => handleAddSampleSticker(sticker)} />
            ))}
          </StickerSelectionContainer>
        </TextEditContainer>
      )}

      <ImageContainer ref={imageContainerRef}>
        {selectedImage ? (
          <>
            <Image src={selectedImage} alt="Generated" />
            {generationTime ? (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>이미지 생성 시간: {generationTime}초</p>
            ) : (
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>이미지 생성 시간: ??초</p>
            )}
          </>
        ) : (
          <Placeholder>이미지가 없습니다.</Placeholder>
        )}

        {texts.map((textObj, index) => (
          <TextOverlay
            key={index}
            top={textObj.top}
            left={textObj.left}
            bold={textObj.bold}
            italic={textObj.italic}
            underline={textObj.underline}
            color={textObj.color}
            fontSize={textObj.fontSize}
            fontFamily={textObj.fontFamily}
            onMouseDown={(event) => handleDragStart(index, 'text', event)}
            onClick={() => setSelectedTextIndex(index)}
            style={{
              border: selectedTextIndex === index ? '2px dashed blue' : 'none',
            }}
          >
            {textObj.text}
          </TextOverlay>
        ))}

        {stickers.map((sticker, index) => (
          <StickerOverlayContainer
            key={`${sticker.src}-${index}`}
            top={sticker.top}
            left={sticker.left}
            width={sticker.width}
            height={sticker.height}
            selected={selectedStickerIndex === index}
            onMouseDown={(event) => handleStickerClick(index, event)}
          >
            <StickerOverlay
              src={sticker.src}
              onMouseDown={(event) => {
                event.stopPropagation();
                handleStickerClick(index, event);
                handleDragStart(index, 'sticker', event);
              }}
            />
            {selectedStickerIndex === index && (
              <>
                <ResizeHandle
                  direction="n"
                  position="top: 0%; left: 50%;"
                  onMouseDown={(event) => handleStickerResizeStart(index, 'n', event)}
                />
                <ResizeHandle
                  direction="s"
                  position="top: 100%; left: 50%;"
                  onMouseDown={(event) => handleStickerResizeStart(index, 's', event)}
                />
                <ResizeHandle
                  direction="e"
                  position="top: 50%; left: 100%;"
                  onMouseDown={(event) => handleStickerResizeStart(index, 'e', event)}
                />
                <ResizeHandle
                  direction="w"
                  position="top: 50%; left: 0%;"
                  onMouseDown={(event) => handleStickerResizeStart(index, 'w', event)}
                />
              </>
            )}
          </StickerOverlayContainer>
        ))}

        <ButtonGroup>
          <ActionButton
            onClick={() => {
              setShowTextEdit(!showTextEdit);
              setShowStickerEdit(false);
            }}
          >
            텍스트 추가
          </ActionButton>
          <ActionButton
            onClick={() => {
              setShowStickerEdit(!showStickerEdit);
              setShowTextEdit(false);
            }}
          >
            스티커 추가
          </ActionButton>
        </ButtonGroup>
      </ImageContainer>

      <HistoryPane>
        <h3>히스토리</h3>
        {imageHistory.map((image, index) => (
          <HistoryItem key={index}>
            <HistoryImage src={image} alt={`히스토리 ${index}`} />
            <ActionButton onClick={() => handleSelectHistoryImage(image)}>선택</ActionButton>
          </HistoryItem>
        ))}
      </HistoryPane>

      <BottomButton primary onClick={handleCompleteClick}>
        제작 완료
      </BottomButton>
    </PageContainer>
  );
};

export default ImageEditingPage;
