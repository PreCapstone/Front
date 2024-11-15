// MessageInputPage.js
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
  OverlayDiv,
  ButtonContainer,
  HintText,
} from '../style/MessageInputPageStyles';

const MessageInputPage = ({ setActivePage, setMessage, message }) => {
  // State 관리
  const [messageHistory, setMessageHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leftPaneState, setLeftPaneState] = useState({
    isActive: false,
    showOverlay: false,
  });
  const [rightPaneState, setRightPaneState] = useState({
    isActive: false,
    showOverlay: false,
  });

  // 이벤트 핸들러
  const handleGenerateMessage = (newMessage) => {
    setMessage(newMessage);
    setMessageHistory([newMessage, ...messageHistory]);
    setIsModalOpen(false);
  };

  // 왼쪽 패널 마우스 이벤트
  const handleLeftMouseEnter = () => {
    setLeftPaneState({
      isActive: true,
      showOverlay: false,
    });
  };

  const handleLeftMouseLeave = () => {
    setLeftPaneState(prev => ({
      ...prev,
      showOverlay: true,
    }));
  };

  // 오른쪽 패널 마우스 이벤트
  const handleRightMouseEnter = () => {
    setRightPaneState({
      isActive: true,
      showOverlay: false,
    });
  };

  const handleRightMouseLeave = () => {
    setRightPaneState(prev => ({
      ...prev,
      showOverlay: true,
    }));
  };

  return (
    <PageContainer>
      <ContentArea>
        {/* 왼쪽 패널 */}
        <Pane 
          onMouseEnter={handleLeftMouseEnter}
          onMouseLeave={handleLeftMouseLeave}
          className={leftPaneState.isActive ? 'active' : ''}
        >
          <TitleContainer>
            <Title>메시지를</Title>
            <Title>입력하세요</Title>
          </TitleContainer>
          <HintText>잘 안 떠오른다면 →</HintText>
          <ContentWrapper>
            <MessageInput message={message} setMessage={setMessage} />
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
          </ContentWrapper>
          <ButtonContainer />
          <OverlayDiv $show={leftPaneState.showOverlay} />
        </Pane>

        {/* 오른쪽 패널 */}
        <Pane
          onMouseEnter={handleRightMouseEnter}
          onMouseLeave={handleRightMouseLeave}
          className={rightPaneState.isActive ? 'active' : ''}
        >
          <TitleContainer>
            <Title>AI 자동 생성</Title>
          </TitleContainer>
          <MessageHistory messages={messageHistory} />
          <ButtonContainer>
            <Button 
              text="메시지 자동 생성"
              onClick={() => setIsModalOpen(true)}
            />
          </ButtonContainer>
          <OverlayDiv $show={rightPaneState.showOverlay} />
        </Pane>
      </ContentArea>

      {/* 모달 */}
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