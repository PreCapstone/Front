import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import AIGenPage from './pages/AIGenPage';  // AI 생성 페이지 임포트
import OtherPage from './pages/OtherPage';  // 예시로 다른 페이지 추가

const App = () => {
  const [activePage, setActivePage] = useState('AIGen');  // 기본 페이지는 AI 생성

  const renderPage = () => {
    switch (activePage) {
      case 'AIGen':
        return <AIGenPage />;
      case 'Other':
        return <OtherPage />;
      default:
        return <AIGenPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽에 메뉴바를 고정 */}
      <div style={{ width: '250px' }}>
        <MenuBar setActivePage={setActivePage} />
      </div>
      
      {/* 오른쪽에 페이지 표시 */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {renderPage()}  {/* 선택된 페이지를 렌더링 */}
      </div>
    </div>
  );
};

export default App;
