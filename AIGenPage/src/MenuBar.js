import React from 'react';

function MenuBar({ currentPage, onPageChange }) {
  const menuItems = ['AI 자동 생성', '내 사진', '추천 템플릿'];

  return (
    <div className="menu-bar">
      {menuItems.map(item => (
        <div 
          key={item} 
          className={`menu-item ${currentPage === item ? 'active' : ''}`} 
          onClick={() => onPageChange(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default MenuBar;
