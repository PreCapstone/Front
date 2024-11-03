import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const ByteCount = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
`;

const Button = styled.button`
  margin-top: 20px;
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

const MessageInput = ({ value, onPromptChange, onGenerateImage }) => {
  const handlePromptChange = (e) => {
    onPromptChange(e.target.value); // 부모로부터 받은 함수 호출
  };

  const handleGenerateImage = () => {
    if (onGenerateImage) {
      onGenerateImage(); // 이미지 생성 핸들러 호출
    }
  };

  return (
    <Container>
      <TextArea
        value={value} // 부모로부터 받은 value 사용
        onChange={handlePromptChange}
        placeholder="메시지를 입력해주세요."
      />
      <ByteCount>{value.length}/2000byte</ByteCount>
      <Button onClick={handleGenerateImage}>AI 자동 생성</Button>
    </Container>
  );
};

export default MessageInput;
