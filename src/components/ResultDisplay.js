// src/components/ResultDisplay.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 10px;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 800px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResultDisplay = ({ image }) => {
  return (
    <Container>
      <ImageBox>
        {image ? <img src={image} alt="생성된 이미지" /> : '최근 이미지들이 여기 표시됩니다.'}
      </ImageBox>
    </Container>
  );
};

export default ResultDisplay;
