import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  resize: none;
`;

const ByteCount = styled.div`
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const SampleImagesContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const SampleImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border: ${({ isSelected }) => (isSelected ? '3px solid #6a1bb3' : '1px solid #ccc')};
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
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

const RequirementsPage = ({ setActivePage, requirement, setRequirement, setSampleImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const sampleImages = [
    'https://via.placeholder.com/100', 
    'https://via.placeholder.com/101', 
    'https://via.placeholder.com/102'
  ];

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setSampleImage(image); // 선택된 이미지 전달
  };

  return (
    <PageContainer>
      <h2>요구사항을 적어주세요</h2>
      <Textarea
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        placeholder="요구사항을 입력해주세요."
      />
      <ByteCount>{new TextEncoder().encode(requirement).length} / 200 bytes</ByteCount>

      <h3>샘플 이미지 선택 (선택 사항)</h3>
      <SampleImagesContainer>
        {sampleImages.map((img, index) => (
          <SampleImage
            key={index}
            src={img}
            alt={`샘플 ${index + 1}`}
            isSelected={selectedImage === img}
            onClick={() => handleSelectImage(img)}
          />
        ))}
      </SampleImagesContainer>

      <ButtonContainer>
        <ActionButton onClick={() => setActivePage('KeywordSelection')}>← 이전</ActionButton>
        <ActionButton primary onClick={() => setActivePage('ImageEditing')}>이미지 생성</ActionButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default RequirementsPage;

