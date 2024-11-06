import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import MessageInputPage from './pages/MessageInputPage';
import KeywordSelectionPage from './pages/KeywordSelectionPage';
import RequirementsPage from './pages/RequirementsPage';
import ImageEditingPage from './pages/ImageEditingPage';

const App = () => {
  const [activePage, setActivePage] = useState('MessageInput');
  const [message, setMessage] = useState(''); // 메시지 상태
  const [keywords, setKeywords] = useState([]); // 추출된 키워드 상태
  const [requirement, setRequirement] = useState(''); // 요구사항 상태
  const [imageHistory, setImageHistory] = useState([]); // 생성된 이미지 히스토리
  const [generatedImage, setGeneratedImage] = useState(null); // Stable Diffusion으로 생성된 이미지

  const renderPage = () => {
    switch (activePage) {
      case 'MessageInput':
        return (
          <MessageInputPage
            setActivePage={setActivePage}
            message={message}
            setMessage={setMessage}
          />
        );
      case 'KeywordSelection':
        return (
          <KeywordSelectionPage
            setActivePage={setActivePage}
            message={message}
            keywords={keywords}
            setKeywords={setKeywords}
          />
        );
      case 'Requirements':
        return (
          <RequirementsPage
            setActivePage={setActivePage}
            requirement={requirement}
            setRequirement={setRequirement}
            setGeneratedImage={setGeneratedImage} // 이미지 생성 후 상태 업데이트
          />
        );
      case 'ImageEditing':
        return (
          <ImageEditingPage
            generatedImage={generatedImage}
            imageHistory={imageHistory}
            setImageHistory={setImageHistory}
          />
        );
      default:
        return <MessageInputPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <MenuBar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flexGrow: 1, padding: '20px' }}>{renderPage()}</div>
    </div>
  );
};

export default App;







