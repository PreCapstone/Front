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
  cursor: ${({ dragging }) => (dragging ? "grabbing" : "grab")};
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
  cursor: ${({ dragging }) => (dragging ? "grabbing" : "grab")};
  z-index: 999; // 버튼보다 낮아야 함
  pointer-events: auto; // 클릭 이벤트 허용
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
  const [dragging, setDragging] = useState(false);
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
        const imageContainerRect = imageContainerRef.current.getBoundingClientRect();
        const renderedWidth = imageContainerRect.width;
        const renderedHeight = imageContainerRect.height;
      
        const aspectRatio = img.width / img.height;

        // 캔버스 크기 설정
        if (aspectRatio >= 1) {
          canvas.width = renderedWidth;
          canvas.height = renderedWidth / aspectRatio;
        } else {
          canvas.height = renderedHeight;
          canvas.width = renderedHeight * aspectRatio;
        }
    
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        texts.forEach((textObj) => {
          const relativeLeft = textObj.left / img.width;
          const relativeTop = textObj.top / img.height;
          ctx.font = `${textObj.bold ? "bold " : ""}${textObj.italic ? "italic " : ""}${textObj.fontSize}px ${textObj.fontFamily}`;
          ctx.fillStyle = textObj.color;
          ctx.fillText(textObj.text, relativeLeft * canvas.width, relativeTop * canvas.height);
        });
  
        await Promise.all(
          stickers.map(
            (sticker) =>
              new Promise((resolve) => {
                const stickerImg = new window.Image();
                stickerImg.src = sticker.src;
                stickerImg.onload = () => {
                  const relativeLeft = sticker.left / renderedWidth;
                  const relativeTop = sticker.top / renderedHeight;
                  ctx.drawImage(
                    stickerImg,
                    relativeLeft * canvas.width,
                    relativeTop * canvas.height,
                    (sticker.width / renderedWidth) * canvas.width, // 스티커 너비 조정
                    (sticker.height / renderedHeight) * canvas.height // 스티커 높이 조정
                  );
                  resolve(); // 스티커 렌더링 완료
                };
              })
          )
        );
  
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
          console.log("Image Ratio:", img.width / img.height);
          console.log("Canvas Ratio:", canvas.width / canvas.height);
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

  const stickersRef = useRef([]);
  const draggingIndexRef = useRef(null);
  const dragStartPositionRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (index, type, event) => {
    if (index === null || type === null) return; // index와 type이 유효하지 않으면 중단
  
    event.preventDefault();
    const containerRect = imageContainerRef.current.getBoundingClientRect();
  
    draggingIndexRef.current = { index, type };
    dragStartPositionRef.current = {
      x: event.clientX - containerRect.left, // 컨테이너 기준 좌표
      y: event.clientY - containerRect.top, // 컨테이너 기준 좌표
    };

    setDragging(true);
  };  
  
  const imageContainerRef = useRef(null);
  
  const handleDrag = (event) => {
    if (!draggingIndexRef.current || draggingIndexRef.current.index === null) {
      return; // 드래그 상태가 유효하지 않으면 중단
    }
  
    const { index, type } = draggingIndexRef.current;
    const containerRect = imageContainerRef.current.getBoundingClientRect();
    const deltaX = event.clientX - containerRect.left - dragStartPositionRef.current.x;
    const deltaY = event.clientY - containerRect.top - dragStartPositionRef.current.y;
  
    if (type === "text") {
      setTexts((prevTexts) => {
        return prevTexts.map((text, i) => {
          if (i === index) {
            return {
              ...text,
              left: Math.max(0, text.left + deltaX),
              top: Math.max(0, text.top + deltaY),
            };
          }
          return text;
        });
      });
    } else if (type === "sticker") {
      setStickers((prevStickers) => {
        return prevStickers.map((sticker, i) => {
          if (i === index) {
            return {
              ...sticker,
              left: Math.max(0, sticker.left + deltaX),
              top: Math.max(0, sticker.top + deltaY),
            };
          }
          return sticker;
        });
      });
    }
  
    dragStartPositionRef.current = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    };
  };  
  
const handleDragEnd = () => {
  setDragging(false);
  draggingIndexRef.current = null;
  dragStartPositionRef.current = { x: 0, y: 0 };
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
    console.log("Delete sticker index:", index); // 디버깅용 로그
  
    // 스티커 삭제 및 상태 업데이트
    setStickers((prevStickers) => {
      const updatedStickers = prevStickers.filter((_, i) => i !== index);
      console.log("Updated Stickers:", updatedStickers);
      return updatedStickers;
    });
  
    // stickers 상태가 업데이트된 후, selectedStickerIndex를 업데이트
    setTimeout(() => {
      setSelectedStickerIndex((prevIndex) => {
        if (index >= stickers.length - 1) {
          // 삭제 후 남은 스티커가 없는 경우
          return null;
        }
        return Math.min(prevIndex, stickers.length - 2); // 마지막 스티커 선택
      });
    }, 0);
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
        console.error('Error fetching user images in ImageEdtingPage:', error);
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
    event.stopPropagation(); // 부모 이벤트로의 전파 중단
    if (selectedStickerIndex === index) {
      // 이미 선택된 상태면 선택 해제
      setSelectedStickerIndex(null);
    } else {
      // 새 스티커 선택
      setSelectedStickerIndex(index);
    }
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
  
  const handleStickerResize = (event) => {
    if (!draggingIndex || draggingIndex.type !== "resize") return;
  
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
  
    setStickers((prevStickers) => {
      const updatedStickers = [...prevStickers];
      const sticker = updatedStickers[index];
  
      // 크기와 위치 계산
      if (direction.includes("e")) {
        sticker.width = Math.max(20, initialWidth + deltaX);
      }
      if (direction.includes("s")) {
        sticker.height = Math.max(20, initialHeight + deltaY);
      }
      if (direction.includes("w")) {
        sticker.width = Math.max(20, initialWidth - deltaX);
        sticker.left = Math.max(initialLeft + deltaX, 0);
      }
      if (direction.includes("n")) {
        sticker.height = Math.max(20, initialHeight - deltaY);
        sticker.top = Math.max(initialTop + deltaY, 0);
      }
  
      return updatedStickers;
    });
  };  

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
    if (stickers.length === 0) {
      setSelectedStickerIndex(null);
    } else if (selectedStickerIndex >= stickers.length) {
      setSelectedStickerIndex(stickers.length - 1);
    }
  }, [stickers, selectedStickerIndex]);  

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
      if (!draggingIndexRef.current) return;
  
      if (draggingIndexRef.current.type === "resize") {
        handleStickerResize(event);
      } else if (draggingIndexRef.current.type === "drag") {
        handleDrag(event);
      }
    };
  
    const handleMouseUp = () => {
      if (draggingIndexRef.current) {
        handleDragEnd();
      }
    };
  
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);  
  
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
            key={`${sticker.src}-${index}`} // 고유 ID 부여
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
                    handleStickerDragStart(index, event);
                  }}
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
                      zIndex: 1000, // 버튼을 가장 위로 올림
                      pointerEvents: "auto", // 클릭 이벤트 허용
                    }}
                    onMouseDown={(event) => {
                      event.stopPropagation(); // 부모 요소로 이벤트 전파 차단
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteSticker(index)
                    }}
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
