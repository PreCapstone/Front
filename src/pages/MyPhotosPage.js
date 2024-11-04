// src/pages/MyPhotosPage.js
import React from 'react';
import styled from 'styled-components';
import ImageDisplay from '../components/ImageDisplay';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const LeftPane = styled.div`
  width: 70%;
  padding: 10px;
`;

const RightPane = styled.div`
  width: 30%;
  padding: 10px;
  border-left: 1px solid #ddd;
`;

const MyPhotosPage = ({ imageSrc, setImageSrc }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <LeftPane>
        <h2>내 사진</h2>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <ImageDisplay imageSrc={imageSrc} />
      </LeftPane>
      <RightPane>
        <h2>생성 결과</h2>
        {imageSrc ? (
          <ImageDisplay imageSrc={imageSrc} />
        ) : (
          <p>선택한 사진이 여기에 표시됩니다.</p>
        )}
      </RightPane>
    </Container>
  );
};

export default MyPhotosPage;
