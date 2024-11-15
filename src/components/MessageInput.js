import React from 'react';
import styled from 'styled-components';

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  resize: none;
  color: black;
`;

const ByteCount = styled.p`
  font-size: 14px;
  text-align: right;
  margin: 5px 0;
  color: ${({ isOverLimit }) => (isOverLimit ? 'red' : '#666')};
`;

const MessageInput = ({ message, setMessage }) => {
  const byteCount = new TextEncoder().encode(message).length;
  const isOverLimit = byteCount > 80;

  return (
    <div>
      {/* <h2>메시지 입력</h2> */}
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <ByteCount isOverLimit={isOverLimit}>
        {byteCount} / 80 bytes
      </ByteCount>
    </div>
  );
};

export default MessageInput;
