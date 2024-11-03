// MessageGenerate.js
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 10px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
`;

const GenerateButton = styled.button`
  padding: 10px;
  background-color: #9B30FF;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #6a1bb3;
  }
`;

const MessageGenerate = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');

  const handleInputChange = (e) => setPrompt(e.target.value);

  return (
    <Container>
      <InputField
        placeholder="프롬프트 입력"
        value={prompt}
        onChange={handleInputChange}
      />
      <GenerateButton onClick={() => onGenerate(prompt)}>
        GPT 자동 생성
      </GenerateButton>
    </Container>
  );
};

export default MessageGenerate;