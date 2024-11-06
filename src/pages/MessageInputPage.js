import React, { useState } from 'react';
import styled from 'styled-components';
import MessageInput from '../components/MessageInput';
import MessageHistory from '../components/MessageHistory';
import ModalOverlay from '../components/ModalOverlay';
import MessageRequestModal from '../components/MessageRequestModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ContentArea = styled.div`
  display: flex;
  flex-grow: 1;
`;

const LeftPane = styled.div`
  width: 70%;
  padding: 10px;
`;

const RightPane = styled.div`
  width: 30%;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ primary }) => (primary ? '#6A1BB3' : '#ddd')};
  color: ${({ primary }) => (primary ? 'white' : 'black')};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#531299' : '#bbb')};
  }
`;

const MessageInputPage = ({ setActivePage, message, setMessage }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateMessage = (generatedMessage) => {
    setMessage(generatedMessage);
    setMessageHistory([generatedMessage, ...messageHistory]);
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <ContentArea>
        <LeftPane>
          <MessageInput message={message} setMessage={setMessage} />
          <ActionButton onClick={() => setIsModalOpen(true)}>메시지 자동 생성</ActionButton>
        </LeftPane>
        <RightPane>
          <MessageHistory messages={messageHistory} />
        </RightPane>
      </ContentArea>
      <ButtonContainer>
        <ActionButton>메시지만 사용하기</ActionButton>
        <ActionButton primary onClick={() => setActivePage('KeywordSelection')}>입력 완료</ActionButton>
      </ButtonContainer>

      {isModalOpen && (
        <ModalOverlay>
          <MessageRequestModal
            onClose={() => setIsModalOpen(false)}
            onGenerate={handleGenerateMessage}
          />
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default MessageInputPage;



