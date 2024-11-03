// src/App.js
import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import AIGenPage from './pages/AIGenPage';
import TemplatePage from './pages/TemplatePage';
import axios from 'axios';

const App = () => {
  const [activePage, setActivePage] = useState('AIGen');
  const [imageSrc, setImageSrc] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // 메시지 생성 함수
  const handleGenerateMessage = (newPrompt) => {
    setGeneratedMessage(newPrompt); // 메시지 상태 업데이트
  };

  // 이미지 생성 함수
  const handleGenerateImage = async () => {
    try {
      const response = await axios.post('/SD/api/create-image', {
        initImageURL: '',
        prompt: prompt,
      });

      if (response.status === 200) {
        setImageSrc(response.data.imageURL);
        setImageUploaded(true);
      }
    } catch (error) {
      console.error("이미지 생성 오류:", error);
    }
  };

  // 파일 선택 시 이미지 업로드 처리
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 창 열기
  const openFileDialog = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleFileUpload;
    fileInput.click();
  };

  // 현재 활성화된 페이지 렌더링
  const renderPage = () => {
    switch (activePage) {
      case 'AIGen':
        return (
          <AIGenPage
            imageSrc={imageSrc}
            generatedMessage={generatedMessage}
            handleGenerateMessage={handleGenerateMessage}
            handleGenerateImage={handleGenerateImage}
            keywords={keywords}
            setKeywords={setKeywords}
          />
        );
      case 'Template':
        return <TemplatePage />;
      default:
        return <AIGenPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px' }}>
        <MenuBar
          setActivePage={setActivePage}
          activePage={activePage}
          openFileDialog={openFileDialog}
          imageUploaded={imageUploaded}
        />
      </div>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;




