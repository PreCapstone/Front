import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import MessageInputPage from './pages/MessageInputPage';
import KeywordSelectionPage from './pages/KeywordSelectionPage';
import RequirementsPage from './pages/RequirementsPage';
import ImageEditingPage from './pages/ImageEditingPage';
import SMSPage from './pages/MessageSendPage';
import LoginPage from './pages/LoginPage';  // 로그인 페이지
import SignupPage from './pages/SignupPage';  // 회원가입 페이지
import ImageSendPage from './pages/ImageSendPage';
import SendSuccessPage from './pages/SendSuccessPage';

const App = () => {
  const [activePage, setActivePage] = useState('LoginPage');
  const [message, setMessage] = useState(''); // 메시지 상태
  const [requirement, setRequirement] = useState(''); // 요구사항 상태 추가
  const [imageHistory, setImageHistory] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [keywords, setKeywords] = useState([]); // 키워드 상태 추가
  const [editedImage, setEditedImage] = useState(null); // 편집된 이미지 상태 추가
  const [generationTime, setGenerationTime] = useState(null);
  const [generationAPITime, setGenerationAPITime] = useState(null);

  const resetMessage = () => {
    setMessage(''); // 메시지 초기화
    setRequirement(''); // 요구사항 초기화
    setKeywords([]); // 키워드 초기화
    setGeneratedImage(null); // 생성된 이미지 초기화
    setEditedImage(null); // 편집된 이미지 초기화
    setGenerationTime(null); // 이미지 생성 시간 초기화
  };

  const renderPage = () => {
    switch (activePage) {
      case 'LoginPage':
        return (
          <LoginPage
            setActivePage={setActivePage}
          />
        );
      case 'SignupPage':
        return (
          <SignupPage
            setActivePage={setActivePage}
          />
        ); 
      case 'MessageInput':
        return (
          <MessageInputPage
            setActivePage={setActivePage}
            setMessage={setMessage}
            message={message}
          />
        );
      case 'KeywordSelection':
        return <KeywordSelectionPage
            message={message}
            setActivePage={setActivePage}
            setKeywords={setKeywords} // 키워드 상태 업데이트 함수 전달
              />;
      case 'Requirements':
        return (
            <RequirementsPage
                setActivePage={setActivePage}
                setRequirement={setRequirement}
                requirement={requirement}
                selectedKeywords={keywords} // 키워드 상태 전달
                previousMessage={message}  // 이전 메시지 전달
                setGeneratedImage={setGeneratedImage}
                setImageHistory={setImageHistory}
                setGenerationTime={setGenerationTime}
                setGenerationAPITime={setGenerationAPITime}
            />
        );

      case 'ImageEditingPage':
      return (
        <ImageEditingPage
          generatedImage={generatedImage}
          imageHistory={imageHistory}
          setImageHistory={setImageHistory}
          setActivePage={setActivePage}
          setGeneratedImage={setGeneratedImage}
          setEditedImage={setEditedImage} // 편집된 이미지 저장 함수 전달
          generationTime={generationTime}
          generationAPITime={generationAPITime}
        />
      );
    
      case 'SMSPage': // SMSPage 전달
        return <SMSPage previousMessage={message} setActivePage={setActivePage} />;
      case 'ImageSendPage':
        return (
          <ImageSendPage
            previousMessage={message}
            setActivePage={setActivePage}
            generatedImage={generatedImage} // 기본 생성 이미지
            editedImage={editedImage}       // 편집된 이미지
          />
        );        
      case 'SendSuccessPage':
        return (
          <SendSuccessPage
            resetMessage={resetMessage}
            setActivePage={setActivePage}  
          />
        );
      default:
        return (
          <MessageInputPage
            setActivePage={setActivePage}
            setMessage={setMessage}
            message={message}
            editedImage={generatedImage}
          />
        );
    }
  };

  const shouldShowMenuBar = activePage !== 'SMSPage' && activePage !== 'LoginPage' && activePage !== 'SignupPage' &&
                            activePage !== 'ImageSendPage' && activePage !== 'SendSuccessPage';

  return (
    <div style={{ display: activePage === 'SMSPage' ? 'block' : 'flex', height: '100vh' }}>
      {shouldShowMenuBar && (
        <MenuBar activePage={activePage} setActivePage={setActivePage} setGeneratedImage={setGeneratedImage} />
      )}
      <div style={{ flexGrow: 1, padding: '0px' }}>{renderPage()}</div>
    </div>
  );
};

export default App;


