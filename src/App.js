import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import AIGenPage from './pages/AIGenPage';
import TemplatePage from './pages/TemplatePage';
import MyPhotosPage from './pages/MyPhotosPage';

const App = () => {
  const [activePage, setActivePage] = useState('AIGen');
  const [imageSrc, setImageSrc] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'AIGen':
        return <AIGenPage imageSrc={imageSrc} setImageSrc={setImageSrc} />;
      case 'Template':
        return <TemplatePage />;
      case 'MyPhotos':
        return <MyPhotosPage imageSrc={imageSrc} setImageSrc={setImageSrc} />;
      default:
        return <AIGenPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px' }}>
        <MenuBar setActivePage={setActivePage} activePage={activePage} />
      </div>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;




