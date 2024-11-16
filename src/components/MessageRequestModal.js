// src/components/MessageRequestModal.js
import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageDisplay = styled.div`
  padding: 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const MessageRequestModal = ({ generatedMessage, originalMessage, onClose, onSelect }) => {
  return (
    <ModalContainer>
      <h2>메시지 비교</h2>
      <MessageDisplay>
        <h3>원본 메시지</h3>
        <p>{originalMessage}</p>
      </MessageDisplay>
      <MessageDisplay>
        <h3>생성된 메시지</h3>
        <p>{generatedMessage}</p>
      </MessageDisplay>
      <ButtonGroup>
        <Button 
          text="원본 사용" 
          onClick={() => onSelect('original')}
          backgroundColor="#ddd"
          textColor="black"
        />
        <Button 
          text="생성된 메시지 사용" 
          onClick={() => onSelect('generated')}
          backgroundColor="#6A1BB3"
        />
        <Button 
          text="닫기" 
          onClick={onClose}
          backgroundColor="#ddd"
          textColor="black"
        />
      </ButtonGroup>
    </ModalContainer>
  );
};

export default MessageRequestModal;