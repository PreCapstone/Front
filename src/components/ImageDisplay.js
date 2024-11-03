// ImageDisplay.js
import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  width: flex;
  height: 500px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageDisplay = ({ imageSrc }) => {
  return (
    <ImageContainer>
      {imageSrc ? <img src={imageSrc} alt="Selected" style={{ maxHeight: '100%', maxWidth: '100%' }} /> : '이미지를 선택하세요'}
    </ImageContainer>
  );
};

export default ImageDisplay;
