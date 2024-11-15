import React, { useState } from 'react';
import MessageInput from '../components/MessageInput';
import MessageHistory from '../components/MessageHistory';
import ModalOverlay from '../components/ModalOverlay';
import MessageRequestModal from '../components/MessageRequestModal';
import Button from '../components/Button';
import { 
  PageContainer, 
  ContentArea, 
  Pane, 
  TitleContainer,
  Title, 
  ContentWrapper,
  OverlayDiv, // 새로 추가된 스타일 컴포넌트
} from '../style/MessageInputPageStyles';

const MessageInputPage = ({ setActivePage, setMessage, message }) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);  // hover 상태 관리
  const [showOverlay, setShowOverlay] = useState(false); // overlay 표시 상태 관리

  const handleGenerateMessage = (newMessage) => {
    setMessage(newMessage);
    setMessageHistory([newMessage, ...messageHistory]);
    setIsModalOpen(false);
  };

  // 마우스가 Pane에 들어왔을 때 실행되는 함수
  const handleMouseEnter = () => {
    setIsActive(true);
    setShowOverlay(false); // overlay 숨김
  };

  // 마우스가 Pane에서 나갔을 때 실행되는 함수
  const handleMouseLeave = () => {
    setShowOverlay(true); // overlay 표시
  };

  return (
    <PageContainer>
      <ContentArea>
        <Pane 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={isActive ? 'active' : ''}
        >
          <TitleContainer>
            <Title>메시지를</Title>
            <Title>입력하세요</Title>
          </TitleContainer>
          <ContentWrapper>
            <MessageInput message={message} setMessage={setMessage} />
            <Button 
              text="메시지 자동 생성"
              onClick={() => setIsModalOpen(true)}
            />
          </ContentWrapper>
          {/* 
            showOverlay 상태가 true일 때 OverlayDiv를 렌더링합니다.
            이 div는 Pane 위에 반투명한 회색 overlay를 생성합니다.
          */}
          <OverlayDiv $show={showOverlay} />
        </Pane>
        <Pane>
          <MessageHistory messages={messageHistory} />
        </Pane>
      </ContentArea>
      <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          text="메시지만 사용하기"
          onClick={() => setActivePage('SMSPage')}
          backgroundColor="#ddd"
          textColor="black"
        />
        <Button 
          text="입력 완료"
          onClick={() => setActivePage('KeywordSelection')}
          backgroundColor="#6A1BB3"
        />
      </div>

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