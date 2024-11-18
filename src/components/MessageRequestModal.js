import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Button from './Button';
import { PRIMARY_COLOR } from '../style/colors';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  padding: clamp(1rem, 2.5vw, 2rem);
  border-radius: clamp(0.5rem, 1.5vw, 0.8rem);
  width: 50vw;
  max-width: 60vw;
  min-width: 40vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
`;

const Title = styled.h2`
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  margin: 0;
  color: #333;
`;

const MessageDisplay = styled.div`
  position: relative;
  padding: clamp(0.8rem, 2vw, 1.2rem);
  border-radius: clamp(0.4rem, 1vw, 0.6rem);
  min-height: 12vh;
  cursor: pointer;
  background: white;
  margin-bottom: 3vh;
  
  border: 0.15vw solid transparent;
  box-shadow: 0 0 0 1px #E0E0E0;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 0 2px ${PRIMARY_COLOR};
  }

  h3 {
    font-size: clamp(1rem, 2vw, 1.3rem);
    margin: 0 0 1.5vh 0;
    color: #333;
  }

  p {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    line-height: 1.5;
    margin: 0;
    color: #666;
    word-break: break-word;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.5vw;
  margin-top: 2vh;
`;

const ConfirmMessage = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  text-align: center;
  color: #333;
  margin: 2vh 0;
  word-break: keep-all;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
`;

const MessageRequestModal = ({ generatedMessage, originalMessage, onClose, onSelect }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [messageToSelect, setMessageToSelect] = useState(null);

  const handleMessageClick = (type) => {
    setMessageToSelect(type);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onSelect(messageToSelect);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setMessageToSelect(null);
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ModalContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title>메시지 비교</Title>
        <AnimatePresence mode="wait">
          {!showConfirm ? (
            <ModalContent
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageDisplay onClick={() => handleMessageClick('original')}>
                <h3>원본 메시지</h3>
                <p>{originalMessage || '(비어 있음)'}</p>
              </MessageDisplay>
              <MessageDisplay onClick={() => handleMessageClick('generated')}>
                <h3>생성된 메시지</h3>
                <p>{generatedMessage || '(비어 있음)'}</p>
              </MessageDisplay>
              <ButtonGroup>
                <Button 
                  text="닫기" 
                  onClick={onClose}
                  backgroundColor="#ddd"
                  textColor="#333"
                />
              </ButtonGroup>
            </ModalContent>
          ) : (
            <ModalContent
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ConfirmMessage>
                {messageToSelect === 'original' 
                  ? 'AI가 생성한 메시지는 삭제됩니다. 원본 메시지를 선택하시겠습니까?'
                  : '원본 메시지는 삭제됩니다. AI 생성 메시지를 선택하시겠습니까?'}
              </ConfirmMessage>
              <ButtonGroup>
                <Button 
                  text="취소" 
                  onClick={handleCancel}
                  backgroundColor="#ddd"
                  textColor="#333"
                />
                <Button 
                  text="확인" 
                  onClick={handleConfirm}
                  backgroundColor={PRIMARY_COLOR}
                />
              </ButtonGroup>
            </ModalContent>
          )}
        </AnimatePresence>
      </ModalContainer>
    </Overlay>
  );
};

export default MessageRequestModal;