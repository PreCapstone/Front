// src/components/MenuBar.js
import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaClipboardList, FaImage, FaTextHeight } from "react-icons/fa";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f0f0f0;
`;

const MenuItem = styled.button`
  padding: 20px;
  font-size: 18px;
  text-align: left;
  background-color: ${({ active }) => (active ? '#9B30FF' : '#fff')};
  color: ${({ active, disabled }) => (disabled ? '#ccc' : active ? '#fff' : '#000')};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#fff' : '#9B30FF')};
    color: ${({ disabled }) => (disabled ? '#ccc' : '#fff')};
  }
`;

const MenuBar = ({ setActivePage, activePage, openFileDialog, imageUploaded }) => {
  return (
    <MenuContainer>
      <MenuItem active={activePage === 'AIGen'} onClick={() => setActivePage('AIGen')}>
        <FaRobot /> AI 자동 생성
      </MenuItem>
      <MenuItem onClick={openFileDialog}>
        <FaImage /> 내 사진
      </MenuItem>
      <MenuItem active={activePage === 'Template'} onClick={() => setActivePage('Template')}>
        <FaClipboardList /> 추천 템플릿
      </MenuItem>
      <MenuItem
        active={activePage === 'Text'}
        onClick={() => setActivePage('Text')}
        disabled={!imageUploaded}
      >
        <FaTextHeight /> 텍스트
      </MenuItem>
    </MenuContainer>
  );
};

export default MenuBar;


