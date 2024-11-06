import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  height: 100%;
`;

const ImageContainer = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ddd;
  padding: 20px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
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

const HistoryPane = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const HistoryItem = styled.div`
  margin-bottom: 10px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
  display: flex;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  position: absolute;
  bottom: 0;
  width: 100%;
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

const ImageEditingPage = ({ generatedImage, imageHistory, setImageHistory, setActivePage }) => {
  React.useEffect(() => {
    if (generatedImage) {
      setImageHistory([generatedImage, ...imageHistory]);
    }
  }, [generatedImage, imageHistory, setImageHistory]);

  return (
    <PageContainer>
      <ImageContainer>
        {generatedImage ? (
          <Image src={generatedImage} alt="Generated" />
        ) : (
          <Placeholder>이미지가 없습니다.</Placeholder>
        )}
      </ImageContainer>

      <HistoryPane>
        <h3>히스토리</h3>
        {imageHistory.map((img, index) => (
          <HistoryItem key={index}>
            <img src={img} alt={`히스토리 ${index}`} width="100%" />
          </HistoryItem>
        ))}
      </HistoryPane>

      <ButtonContainer>
        <ActionButton>텍스트 추가</ActionButton>
        <ActionButton>스티커 추가</ActionButton>
        <ActionButton>자르기</ActionButton>
        <ActionButton primary onClick={() => alert('제작 완료!')}>제작 완료</ActionButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default ImageEditingPage;

