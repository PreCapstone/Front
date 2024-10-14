import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: flex;
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

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Container>
      <TextArea
        value={message}
        onChange={handleInputChange}
        placeholder="메시지를 입력해주세요."
      />
      <ByteCount>{message.length}/2000byte</ByteCount>
      <Button onClick={() => console.log('AI 자동 생성 클릭됨')}>AI 자동 생성</Button>
    </Container>
  );
};

export default MessageInput;
