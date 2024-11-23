import styled from 'styled-components';
import { PRIMARY_COLOR } from '../style/colors';
import React, { useState, useEffect } from 'react';

const Textarea = styled.textarea`
  width: 100%;
  height: 20vh;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: ${PRIMARY_COLOR};
`;

const ByteCount = styled.p`
  font-size: 14px;
  text-align: right;
  margin: 5px 0;
  color: ${({ isOverLimit }) => (isOverLimit ? 'red' : '#666')};
`;

const MessageInput = ({ message, setMessage }) => {
  const [eucKrByteCount, setEucKrByteCount] = useState(0);
  const maxBytes = 90;

// js는 euc kr 미지원이라 글자 자체는 utf8이지만 뿌리오는 euc kr 기준이니까 그걸로 셈

  useEffect(() => {
    const calculateEucKrByteCount = (str) => {
      let count = 0;
      for (let i = 0; i < str.length; i++) { 
        const charCode = str.charCodeAt(i);
        if (charCode <= 0x7F) { // ascii 
          count += 1;
        } else if (charCode <= 0xFFFF) { // 한글 등
          count += 2;
        } else {
          count += 3;  // 이모지는 어차피 euc kr에서 미지원이지만 일단 3바이트로
        }
      }
      return count;
    };

    setEucKrByteCount(calculateEucKrByteCount(message));
  }, [message]);

  const isOverLimit = eucKrByteCount > maxBytes;

  return (
    <div>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <ByteCount isOverLimit={isOverLimit}>
        {eucKrByteCount} / {maxBytes} bytes (90 초과시 MMS)
      </ByteCount>
    </div>
  );
};

export default MessageInput;
