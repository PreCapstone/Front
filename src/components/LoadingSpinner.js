// 스피너(팩맨)
import React from 'react';
import { PacmanLoader } from 'react-spinners';
import styled from 'styled-components';
import { PRIMARY_COLOR } from '../style/colors';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LoadingText = styled.div`
  color: white;
  margin-top: 20px;
  font-size: 1.5rem;
`;

const LoadingSpinner = ({ text = "로딩중입니다..." }) => {
  return (
    <LoaderContainer>
      <PacmanLoader
        color={PRIMARY_COLOR}
        loading={true}
        size={45}
      />
      <LoadingText>
        {text}
      </LoadingText>
    </LoaderContainer>
  );
};

export default LoadingSpinner;