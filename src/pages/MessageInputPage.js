// "메시지 입력" 페이지 = 사용자가 메시지를 입력하거나 AI로 생성할 수 있는 React 컴포넌트 파일.
import React, { useState } from 'react';
import MessageInput from '../components/MessageInput';
import ModalOverlay from '../components/ModalOverlay';
import MessageRequestModal from '../components/MessageRequestModal';
import Button from '../components/Button';
import GPTInputForm from '../components/GPTInputForm';
import { createGPTMessage } from '../services/gptService';
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

// 형식 : const(상수) 컴포넌트명 = ({props = 전달받는 속성, 부모에서 자식으로 데이터 전달 받을 때 사용, 매개변수 비슷}) => {컴포넌트 내용}
const MessageInputPage = ({ setActivePage, setMessage, message }) => {
  // State 관리. 리액트에서 이미 정의돼있는 useState 훅을 사용. 컴포넌트에 상태 생성할 때 쓰고 현재 상태값이랑 상태값 업뎃하는 함수 리턴함. 이걸 배열 구조 분해라는 문법 써서 변수에 넣기.
  // 리턴되는 set어쩌고State 함수는, 인자로 bool 주면 해당 상태 업뎃되고 컴포넌트 렌더링 다시 된다
  // useState 내부에 있는 건 상태 초기값
  const [leftPaneState, setLeftPaneState] = useState({
    isActive: false,
    showOverlay: false,
  });
  const [rightPaneState, setRightPaneState] = useState({
    isActive: false,
    showOverlay: false,
  });
  //모달창 열렸는지, 로딩중인지. 마지막은 현재 생성된 메세지 저장하는 애.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // 왼쪽 패널 마우스 이벤트. 마우스 올려놓으면 이벤트 처리 (글자 타이핑 되고 ui 나오는 이벤트), 마우스 떠나면 관련 처리 (회색 오버레이 씌워주기)
  const handleLeftMouseEnter = () => {
    setLeftPaneState({
      isActive: true,
      showOverlay: false,
    });
  };
// prev => ({ ... }) 방식은 이전 상태 기반으로 새 상태 만드는 함수. prev가 이전 상태를 뜻한다. ...prev는 스프레드 연산자인데 이전 상태의 모든 속성을 새 객체에 복사한다고 함. 즉 showOverlay만 바꾸고 나머지는 그대로 가져오란 소리
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

  // GPT 메시지 생성 핸들러. 시간 걸릴 수 있으니 비동기로 처리
  const handleGPTSubmit = async (formData) => {
    setIsLoading(true); //로딩화면 띄우기
    try {
      // 응답 받아서 생성된 메시지 저장하려고 만들어둔 상태값에 저장하고 모달 열기
      const response = await createGPTMessage(formData);
      setGeneratedMessage(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error('메시지 생성 실패:', error);
      alert('메시지 생성에 실패했습니다.');
    } finally {
      // 이걸 여기에서야 넣는게 맞나 생각 좀 해보기
      setIsLoading(false);
    }
  };

  // 메시지 선택 핸들러. 모달창에서 사용자가 메시지 선택시 호출. 모달창에선 기존에 입력한 문자 vs gpt가 만든 문자 중 선택하게 돼있음. 선택된 메시지 타입이 generated면(gpt가 선택한 문자를 골랐다면) 현재 메시지를 gpt가 만든 메시지로 set
  const handleMessageSelect = (type) => {
    // 엄격한 동등 비교. 타입, 값 전부 같은지
    if (type === 'generated') {
      setMessage(generatedMessage);
    }
    setIsModalOpen(false);
  };

  return (
    // styled-components를 사용하여 정의된 커스텀 컴포넌트기 때문에 이름 맘대로 지어도 되는 거임. 물론 스타일 코드에 관련된 스타일 있어야 에러 안 뜨겠지
    // style 코드에선 const PageContainer = styled.div`스타일내용` 이런 식으로 해놨는데 기본적으로 div지만 추가 스타일 적용됐다라는 뜻임
    <PageContainer>
      <ContentArea>
        {/* 왼쪽 패널 */}
        <Pane 
          onMouseEnter={handleLeftMouseEnter}
          onMouseLeave={handleLeftMouseLeave}
          // class가 js 예약어라서 리액트에선 className 쓰는 거, 같은 뜻. isActive면 클래스명 active 줌. 클래스명 active는 pane의 style에서 사용할 예정
          // 상태관리 vs 클래스명 바꿔치기 : 상태관리는 데이터값 관련 + 변경되면 렌더링 다시됨. 클래스명 바꿔치기는 주로 ui 변경 관련돼서 사용.
          className={leftPaneState.isActive ? 'active' : ''}
        >
          <TitleContainer>
            <Title>메시지를</Title>
            <Title>입력하세요</Title>
          </TitleContainer>
          <HintText>잘 안 떠오른다면 →</HintText>
          <ContentWrapper>
            {/* 컴포넌트 부르고 props 전달. 컴포넌트명 제외한 모든 건 props로 전달할 내용이라고 생각.
            왼쪽의 message: MessageInput 컴포넌트 내에서 사용될 prop의 이름
            오른쪽의 {message}: 현재 컴포넌트(부모)의 state나 변수 message의 값을 전달 */}
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
          {/* $ : 해당 prop이 실제 DOM 요소에 전달되지 않고, 오직 스타일링 목적으로만 사용됨을 나타냄 (DOM은 웹 페이지 구조 표현하는 애. HTML 요소로 전달 안 된다는 소리)
          마우스 어딨냐에 따라 위에서 showOverlay 변경됐는데 그걸 그대로 따라감, $show에 따라 style에서 overlay 투명도 변경
          showOverlay 직접 안 주고 $show로 주는 이유 : style에서 showOverlay 직접 다루면 DOM에 영향 주거나 충돌할 수도 있음. 코드 가독성상 좋음.
          */}
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
          <ContentWrapper>
            <GPTInputForm onSubmit={handleGPTSubmit} />
          </ContentWrapper>
          <OverlayDiv $show={rightPaneState.showOverlay} />
        </Pane>
      </ContentArea>

      {/* ModalOverlay: 모달의 배경, 전체 화면을 덮는 반투명한 오버레이 > 어디선가 재사용 할 수도 있을듯? 이미 로딩할 때, 메시지 선택 할 때 두 곳에서 사용중 
          MessageRequestModal: 실제 모달의 내용, 그니까 내가 정의한 원본 메시지와 생성된 메시지를 비교하고 선택할 수 있는 UI. 재사용 할 일 없다
      */}

      {/* 모달
      리액트식 if문 변형. isLoading이 참이면 모달창 띄우고 false되면 꺼라. 
      */}
      {isLoading && (
        <ModalOverlay>
          <div>메시지를 생성하고 있습니다...</div>
        </ModalOverlay>
      )}
      
      
      {isModalOpen && !isLoading && (
        <ModalOverlay> 
          <MessageRequestModal
          // 복습 : 이 컴포넌트 부르면서 props로 내 message를 전달, 저기선 originalMessage라고 불리게 될 거임. 또 그거랑 별개ㅗㄹ 닫거나 뭔가를 선택하면 관련 기능 실행할거임.
            originalMessage={message}
            generatedMessage={generatedMessage}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleMessageSelect}
          />
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default MessageInputPage;