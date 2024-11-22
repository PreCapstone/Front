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
    padding: 20px;
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
    display: flex;
    justify-content: center;
    align-items: center;
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

const StickerOverlay = styled.img`
    position: absolute;
    top: ${({ top }) => top}px;
    left: ${({ left }) => left}px;
    cursor: move;
    width: 60px;
    height: 60px;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 20px;
    overflow-y: auto;
    max-height: 90%; /* 이미지 높이에 맞춰 조정 */
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
  height: 40px; /* 텍스트 추가 버튼과 동일한 높이 */
  background-color: blue;
  color: white;
`;

const StickerOverlayContainer = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width || 60}px;
  height: ${({ height }) => height || 60}px;
  border: ${({ selected }) => (selected ? '2px dashed blue' : 'none')};
  box-sizing: border-box;
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
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [fontSize] = useState(30);
  const [fontFamily] = useState('Malgun Gothic');
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [selectedImage, setSelectedImage] = useState(generatedImage);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');

  const fonts = ['Malgun Gothic', 'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Helvetica', 'Trebuchet MS', 'Tahoma', 'Dotum', 'Gulim']; // 글꼴 리스트

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
      alert("선택된 이미지가 없습니다. 이미지를 선택하세요.");
      return;
    }
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
  
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
  
    img.onload = async () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        texts.forEach((textObj) => {
          ctx.font = `${textObj.bold ? "bold " : ""}${textObj.italic ? "italic " : ""}${textObj.fontSize}px ${textObj.fontFamily}`;
          ctx.fillStyle = textObj.color;
          ctx.fillText(textObj.text, textObj.left, textObj.top);
        });
  
        stickers.forEach((sticker) => {
          const stickerImg = new window.Image();
          stickerImg.src = sticker.src;
          ctx.drawImage(stickerImg, sticker.left, sticker.top, sticker.width, sticker.height);
        });
  
        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert("이미지 생성에 실패했습니다.");
            return;
          }
  
          // PNG 형식 확인
          if (blob.type !== "image/png") {
            alert("이미지 형식은 PNG만 지원됩니다.");
            return;
          }
  
          const userId = sessionStorage.getItem("userId") || "123";
          const s3Url = await uploadImageToS3(blob, userId);
          setEditedImage(s3Url); // 편집된 이미지 상태 업데이트
          setActivePage("ImageSendPage");
        }, "image/png");
      } catch (error) {
        console.error("이미지 처리 중 오류 발생:", error);
        alert("이미지 처리에 실패했습니다.");
      }
    };
  
    img.onerror = () => {
      alert("이미지를 로드할 수 없습니다. 다시 시도해주세요.");
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
    setDraggingIndex({ index, type }); // 타입("text" 또는 "sticker")과 인덱스를 함께 저장
    setDragStartPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const imageContainerRef = useRef(null);
  
  const handleDrag = (event) => {
    if (draggingIndex) {
      const deltaX = event.clientX - dragStartPosition.x;
      const deltaY = event.clientY - dragStartPosition.y;

      if (imageContainerRef.current) {
        const containerRect = imageContainerRef.current.getBoundingClientRect();

        if (draggingIndex.type === "text") {
          setTexts((prevTexts) => {
            const updatedTexts = [...prevTexts];
            const text = updatedTexts[draggingIndex.index];

            const newLeft = Math.min(
              Math.max((text.left || 0) + deltaX, 0),
              containerRect.width - 10
            );
            const newTop = Math.min(
              Math.max((text.top || 0) + deltaY, 0),
              containerRect.height - 10
            );

            updatedTexts[draggingIndex.index] = { ...text, left: newLeft, top: newTop };
            return updatedTexts;
          });
        } else if (draggingIndex.type === "sticker") {
          setStickers((prevStickers) => {
            const updatedStickers = [...prevStickers];
            const sticker = updatedStickers[draggingIndex.index];

            const newLeft = Math.min(
              Math.max((sticker.left || 0) + deltaX, 0),
              containerRect.width - sticker.width
            );
            const newTop = Math.min(
              Math.max((sticker.top || 0) + deltaY, 0),
              containerRect.height - sticker.height
            );

            updatedStickers[draggingIndex.index] = { ...sticker, left: newLeft, top: newTop };
            return updatedStickers;
          });
        }

        setDragStartPosition({
          x: event.clientX,
          y: event.clientY,
        });
      }
    }
  };
  
  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  const handleDeleteText = () => {
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => prevTexts.filter((_, index) => index !== selectedTextIndex));
      setSelectedTextIndex(null); // 선택 초기화
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
    sampleStickers = []
  }

  const handleAddSampleSticker = useCallback((src) => {
    setStickers((prev) => [
      ...prev,
      { src, top: 50, left: 50, width: 60, height: 60 },
    ]);
    setSelectedStickerIndex(stickers.length); // 기존 상태 활용
  }, [stickers]);

  const handleStickerDragStart = (index, event) => {
    event.stopPropagation();
    setDraggingIndex({
      index,
      type: "drag",
      startX: event.clientX,
      startY: event.clientY,
      initialTop: stickers[index].top,
      initialLeft: stickers[index].left,
    });
  };
  
  

  const handleStickerDrag = useCallback((event) => {
    if (draggingIndex?.type === "drag") {
      const { index, startX, startY, initialTop, initialLeft } = draggingIndex;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
  
      setStickers((prevStickers) => {
        const updatedStickers = [...prevStickers];
        updatedStickers[index].top = initialTop + deltaY;
        updatedStickers[index].left = initialLeft + deltaX;
        return updatedStickers;
      });
    }
  }, [draggingIndex]);
      
  
  const handleDeleteSticker = (index) => {
    setStickers((prevStickers) => {
      const updatedStickers = prevStickers.filter((_, i) => i !== index);
      // 스티커 삭제 후 새로운 선택 설정
      if (updatedStickers.length > 0) {
        setSelectedStickerIndex(updatedStickers.length - 1); // 마지막 스티커 선택
      } else {
        setSelectedStickerIndex(null); // 스티커가 없으면 선택 해제
      }
      return updatedStickers;
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
        const userId = sessionStorage.getItem('userId'); // 사용자 ID 가져오기
        if (!userId) {
          throw new Error('사용자 ID가 존재하지 않습니다.');
        }
        const userImages = await getUserImages(userId); // API 호출
        console.log('응답 데이터:', userImages);
        const userImageUrls = userImages.map((image) => image.userImage).reverse(); // 이미지 URL만 추출
        setImageHistory(userImageUrls); // 히스토리에 저장
      } catch (error) {
        console.error('Error fetching user images:', error);
        alert('사용자 이미지를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchUserImages();
  }, [setImageHistory]);

  const handleSelectHistoryImage = (image) => {
    if (!image) {
      alert('유효하지 않은 이미지입니다.');
      return;
    }
    setSelectedImage(image); // 선택한 이미지를 업데이트
  };

  const handleStickerClick = (index, event) => {
    event.stopPropagation();
    setSelectedStickerIndex(index); // 클릭한 스티커로 선택 이동
  };  

  const handleStickerResizeStart = (index, direction, event) => {
    event.stopPropagation();
    console.log('Resizing started:', { index, direction }); // 디버깅 추가
    setDraggingIndex({
      index,
      type: "resize",
      direction,
      startX: event.clientX,
      startY: event.clientY,
      initialWidth: stickers[index].width,
      initialHeight: stickers[index].height,
      initialTop: stickers[index].top,
      initialLeft: stickers[index].left,
    });
  };  
  
  const handleStickerResize = useCallback((event) => {
    if (draggingIndex?.type === "resize") {
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

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (imageContainerRef.current) {
        const containerRect = imageContainerRef.current.getBoundingClientRect();

        setStickers((prevStickers) => {
          const updatedStickers = [...prevStickers];
          const sticker = updatedStickers[index];

          let newWidth = sticker.width;
          let newHeight = sticker.height;
          let newTop = sticker.top;
          let newLeft = sticker.left;

          switch (direction) {
            case "nw":
              newWidth = Math.max(20, initialWidth - deltaX);
              newHeight = Math.max(20, initialHeight - deltaY);
              newLeft = Math.min(
                Math.max(initialLeft + deltaX, 0),
                containerRect.width - newWidth
              );
              newTop = Math.min(
                Math.max(initialTop + deltaY, 0),
                containerRect.height - newHeight
              );
              break;
            case "ne":
              newWidth = Math.max(20, initialWidth + deltaX);
              newHeight = Math.max(20, initialHeight - deltaY);
              newTop = Math.min(
                Math.max(initialTop + deltaY, 0),
                containerRect.height - newHeight
              );
              break;
            case "sw":
              newWidth = Math.max(20, initialWidth - deltaX);
              newHeight = Math.max(20, initialHeight + deltaY);
              newLeft = Math.min(
                Math.max(initialLeft + deltaX, 0),
                containerRect.width - newWidth
              );
              break;
            case "se":
              newWidth = Math.max(20, initialWidth + deltaX);
              newHeight = Math.max(20, initialHeight + deltaY);
              break;
            default:
              break;
          }

          updatedStickers[index] = {
            ...sticker,
            width: Math.min(newWidth, containerRect.width),
            height: Math.min(newHeight, containerRect.height),
            top: newTop,
            left: newLeft,
          };
          return updatedStickers;
        });
      }
    }
  }, [draggingIndex]);



  const handleMouseUp = useCallback(() => {
    if (draggingIndex?.type === "resize") {
      setStickers((prevStickers) => {
          const updatedStickers = [...prevStickers];
          const stickerElement = document.getElementById(`sticker-${draggingIndex.index}`);
          if (stickerElement) {
              const rect = stickerElement.getBoundingClientRect();
              updatedStickers[draggingIndex.index] = {
                  ...updatedStickers[draggingIndex.index],
                  width: rect.width,
                  height: rect.height,
                  top: rect.top,
                  left: rect.left,
              };
          }
          return updatedStickers;
      });
    }
    setDraggingIndex(null);
  }, []);
      
  useEffect(() => {
    console.log('ImageEditingPage로 전달된 generationTime:', generationTime);
  }, [generationTime]);


  useEffect(() => {
    document.addEventListener("mousemove", handleStickerDrag);
    document.addEventListener("mousemove", handleStickerResize);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleStickerDrag);
      document.removeEventListener("mousemove", handleStickerResize);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleStickerDrag, handleStickerResize]);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
        if (draggingIndex?.type === "resize") {
            handleStickerResize(event);
        } else if (draggingIndex?.type === "drag") {
            handleStickerDrag(event);
        }
    };

    const handleMouseUp = () => {
        if (draggingIndex) {
            setDraggingIndex(null); // 드래그 또는 리사이즈 종료
        }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex, handleStickerResize, handleStickerDrag]);

  
  return (
    <PageContainer onMouseMove={handleDrag} onMouseUp={handleDragEnd}>
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
                  <SketchPicker
                    color={texts[selectedTextIndex]?.color || currentColor}
                    onChangeComplete={handleColorChange}
                  />
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ marginTop: '10px' }}
          />
          <p>샘플 스티커 선택</p>
          <StickerSelectionContainer>
            {sampleStickers.map((sticker, index) => (
              <StickerPreview
                key={index}
                src={sticker}
                alt={`샘플 스티커 ${index}`}
                onClick={() => handleAddSampleSticker(sticker)}
              />
            ))}
          </StickerSelectionContainer>
        </TextEditContainer>
        )}

        <ImageContainer ref={imageContainerRef}>
                {selectedImage ? (
                    <>
                        <Image src={selectedImage} alt="Generated" />
                        {generationTime ? (
                            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                            이미지 생성 시간: {generationTime}초</p> 
                            ) : (
                            <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                            이미지 생성 시간: ??초</p>     
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
            onMouseDown={(event) => handleDragStart(index, "text", event)}
            onClick={() => setSelectedTextIndex(index)} // 텍스트 선택
            style={{
              border: selectedTextIndex === index ? '2px dashed blue' : 'none', // 선택된 텍스트 강조
            }}
            >
              {textObj.text}
            </TextOverlay>
          ))}

          {stickers.map((sticker, index) => (
            <StickerOverlayContainer
            id={`sticker-${index}`} // 고유 ID 부여
            key={index}
            top={sticker.top}
            left={sticker.left}
            width={sticker.width}
            height={sticker.height}
            selected={selectedStickerIndex === index}
            onMouseDown={(event) => handleStickerClick(index, event)}
            >
              <StickerOverlay
                  src={sticker.src}
                  onMouseDown={(event) => handleStickerDragStart(index, event)}
              />
              {selectedStickerIndex === index && (
                <>
                  <ResizeHandle
                    direction="nw"
                    position="top: 0; left: 0;"
                    onMouseDown={(event) =>
                      handleStickerResizeStart(index, "nw", event)
                    }
                  />
                  <ResizeHandle
                    direction="ne"
                    position="top: 0; left: 100%;"
                    onMouseDown={(event) =>
                      handleStickerResizeStart(index, "ne", event)
                    }
                  />
                  <ResizeHandle
                    direction="sw"
                    position="top: 100%; left: 0;"
                    onMouseDown={(event) =>
                      handleStickerResizeStart(index, "sw", event)
                    }
                  />
                  <ResizeHandle
                    direction="se"
                    position="top: 100%; left: 100%;"
                    onMouseDown={(event) =>
                      handleStickerResizeStart(index, "se", event)
                    }
                  />
                  <button
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => handleDeleteSticker(index)}
                  >
                    X
                  </button>
                </>
              )}
            </StickerOverlayContainer>
          ))}

          <ButtonGroup>
            <ActionButton onClick={() => {
              setShowTextEdit(!showTextEdit);
              setShowStickerEdit(false); // 스티커 창 닫기
            }}>
              텍스트 추가
            </ActionButton>
            <ActionButton onClick={() => {
              setShowStickerEdit(!showStickerEdit);
              setShowTextEdit(false); // 텍스트 창 닫기
            }}>
              스티커 추가
            </ActionButton>
          </ButtonGroup>
        </ImageContainer>

        <HistoryPane>
          <h3>히스토리</h3>
          {imageHistory.map((image, index) => (
            <HistoryItem key={index}>
              <HistoryImage src={image} alt={`히스토리 ${index}`} />
              <ActionButton onClick={() => handleSelectHistoryImage(image)}>
                선택
              </ActionButton>
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
