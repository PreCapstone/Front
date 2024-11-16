// 입력받는 텍스트 필드와 바이트 세기 기능을 제공하는 컴포넌트. 
import React from 'react';
import styled from 'styled-components';

const Textarea = styled.textarea`
  width: 100%;
  height: 20vh;
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
      // 부모한테 전달받은 props! textarea 현재 값은 받은 message로, 변할 때마다 setMessage불러서 부모 컴포넌트의 state 바꿔주기.
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      {/* 이건 일단 별 기능 없이 냅두는걸로, 추후 isOverLimit이면 mms api 부르게 바꿔야 될듯..? */}
      <ByteCount isOverLimit={isOverLimit}>
        {byteCount} / 80 bytes
      </ByteCount>
    </div>
  );
};

export default MessageInput;
