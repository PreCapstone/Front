import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 95vh;
  padding: 20px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  resize: none;
`;

const ByteCount = styled.div`
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const SampleImageContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
`;

const SampleImage = styled.img`
  width: 120px;
  height: 120px;
  border: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    border-color: #6a1bb3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ primary }) => (primary ? '#6a1bb3' : '#ddd')};
  color: ${({ primary }) => (primary ? 'white' : 'black')};
  border: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#531299' : '#bbb')};
  }
`;

const RequirementsPage = ({ 
  setActivePage, 
  requirement, 
  setRequirement, 
  sampleImages = [], // 기본값으로 빈 배열 설정
  setGeneratedImage 
}) => {
  const handleTextareaChange = (e) => {
    setRequirement(e.target.value); 
  };

  const handleImageClick = (image) => {
    setGeneratedImage(image); 
  };

  return (
    <PageContainer>
      <h1>요구사항을 적어주세요</h1>
      <Textarea
        value={requirement}
        onChange={handleTextareaChange}
        placeholder="요구사항을 입력해주세요."
      />
      <ByteCount>{new TextEncoder().encode(requirement).length} / 200byte</ByteCount>
      <SampleImageContainer>
        {sampleImages.map((img, index) => (
          <SampleImage
            key={index}
            src={img}
            alt={`샘플 ${index}`}
            onClick={() => handleImageClick(img)}
          />
        ))}
      </SampleImageContainer>
      <ButtonContainer>
        <ActionButton onClick={() => setActivePage('KeywordSelection')}>← 이전</ActionButton>
        <ActionButton primary onClick={() => alert('이미지 생성!')}>이미지 생성</ActionButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default RequirementsPage;



