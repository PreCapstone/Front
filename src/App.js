import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import MessageInputPage from './pages/MessageInputPage';
import KeywordSelectionPage from './pages/KeywordSelectionPage';
import RequirementsPage from './pages/RequirementsPage';
import ImageEditingPage from './pages/ImageEditingPage';

const App = () => {
  const [activePage, setActivePage] = useState('MessageInput');
  const [message, setMessage] = useState('');
  const [imageHistory, setImageHistory] = useState([]); 
  const [generatedImage, setGeneratedImage] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'MessageInput':
        return (
          <MessageInputPage
            setActivePage={setActivePage}
            setMessage={setMessage}
            message={message}
          />
        );
      case 'KeywordSelection':
        return <KeywordSelectionPage setActivePage={setActivePage} />;
      case 'Requirements':
        return (
          <RequirementsPage
            setActivePage={setActivePage}
            setGeneratedImage={setGeneratedImage}
          />
        );
      case 'ImageEditing':
        return (
          <ImageEditingPage
            generatedImage={generatedImage}
            imageHistory={imageHistory}
            setImageHistory={setImageHistory}
            setActivePage={setActivePage}
          />
        );
      default:
        return <MessageInputPage setActivePage={setActivePage} setMessage={setMessage} />;
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




