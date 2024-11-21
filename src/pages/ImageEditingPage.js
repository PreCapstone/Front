import React, { useEffect, useState, useCallback } from 'react';
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
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  cursor: move;
  font-size: 20px;
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

const ColorPickerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

const ColorButton = styled.button`
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    background-color: ${({ color }) => color};
    outline: ${({ active }) => (active ? '2px solid black' : 'none')};

    &:hover {
        outline: 2px solid #555;
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

const SelectButton = styled.button`
  padding: 5px 10px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darkgreen;
  }
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
}) => {
  const [showTextEdit, setShowTextEdit] = useState(false);
  const [showStickerEdit, setShowStickerEdit] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [texts, setTexts] = useState([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [currentImage, setCurrentImage] = useState(generatedImage);

  const colors = ['red', 'blue', 'green', 'black', 'yellow'];

  const handleAddText = () => {
    if (textInput.trim()) {
      setTexts([
        ...texts,
        { text: textInput, top: 50, left: 50, bold: false, italic: false, underline: false, color: 'yellow' },
      ]);
      setTextInput('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStickers((prevStickers) => [
          ...prevStickers,
          { src: e.target.result, top: 50, left: 50 },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteClick = () => {
    setActivePage('ImageSendPage', { editedImage: generatedImage }); // 편집된 이미지 전달
  };

  const handleSelectHistoryImage = (image) => {
    setCurrentImage(image);
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
    if (selectedTextIndex !== null) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[selectedTextIndex] = {
          ...updatedTexts[selectedTextIndex],
          color,
        };
        return updatedTexts;
      });
    }
  };

  const handleDragStart = (index, event) => {
    setDraggingIndex(index);
    setSelectedTextIndex(index); // 텍스트 선택
    setDragStartPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDrag = (event) => {
    if (draggingIndex !== null) {
      const deltaX = event.clientX - dragStartPosition.x;
      const deltaY = event.clientY - dragStartPosition.y;

      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[draggingIndex] = {
          ...updatedTexts[draggingIndex],
          top: updatedTexts[draggingIndex].top + deltaY,
          left: updatedTexts[draggingIndex].left + deltaX,
        };
        return updatedTexts;
      });

      setDragStartPosition({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    const fetchUserImages = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        console.error('사용자 ID가 없습니다.');
        return;
      }
      try {
        const images = await getUserImages(userId);
        setImageHistory(images.map((image) => image.userImage).reverse());
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };
  
    fetchUserImages();
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
          <StyleButtonsContainer>
            <StyleButton active={selectedTextIndex !== null && texts[selectedTextIndex]?.bold} onClick={() => handleStyleChange('bold')}>
              굵게
            </StyleButton>
            <StyleButton active={selectedTextIndex !== null && texts[selectedTextIndex]?.italic} onClick={() => handleStyleChange('italic')}>
              기울임
            </StyleButton>
            <StyleButton active={selectedTextIndex !== null && texts[selectedTextIndex]?.underline} onClick={() => handleStyleChange('underline')}>
              밑줄
            </StyleButton>
          </StyleButtonsContainer>
          <ColorPickerContainer>
            {colors.map((color, index) => (
              <ColorButton
                key={index}
                color={color}
                active={selectedTextIndex !== null && texts[selectedTextIndex]?.color === color}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </ColorPickerContainer>
        </TextEditContainer>
      )}

      {showStickerEdit && (
        <TextEditContainer>
        <h4>스티커 추가</h4>
        <p>스티커 업로드</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ marginTop: '10px' }}
        />
      </TextEditContainer>
      )}

      <ImageContainer>
        {currentImage ? (
          <Image src={currentImage} alt="Selected" />
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
            onMouseDown={(event) => handleDragStart(index, event)}
          >
            {textObj.text}
          </TextOverlay>
        ))}

        {stickers.map((sticker, index) => (
          <StickerOverlay
            key={index}
            src={sticker.src}
            top={sticker.top}
            left={sticker.left}
            onMouseDown={(event) => handleDragStart(index, event)}
          />
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
            <SelectButton onClick={() => handleSelectHistoryImage(image)}>
              선택
            </SelectButton>
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
