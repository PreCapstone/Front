// src/components/PageTitle.js
import React from 'react';
import styled from 'styled-components';

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Description = styled.p`
  margin-bottom: 20px;
`;

const PageTitle = () => {
  return (
    <>
      <Title>AI 자동 생성</Title>
      <Description>AI가 입력된 메시지를 분석하여 이미지를 생성합니다.</Description>
    </>
  );
};

export default PageTitle;
