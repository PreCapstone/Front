import React from 'react';
import styled from 'styled-components';
import { FaRobot, FaClipboardList, FaImage } from "react-icons/fa";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f0f0f0;
`;

const MenuItem = styled.button`
  padding: 20px;
  font-size: 18px;
  background-color: ${({ active }) => (active ? '#9B30FF' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  cursor: pointer;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #9B30FF;
    color: #fff;
  }
`;

const MenuBar = ({ setActivePage, activePage }) => {
  return (
    <MenuContainer>
      <MenuItem active={activePage === 'AIGen'} onClick={() => setActivePage('AIGen')}>
        <FaRobot /> AI 자동 생성
      </MenuItem>
      <MenuItem active={activePage === 'MyPhotos'} onClick={() => setActivePage('MyPhotos')}>
        <FaImage /> 내 사진
      </MenuItem>
      <MenuItem active={activePage === 'Template'} onClick={() => setActivePage('Template')}>
        <FaClipboardList /> 추천 템플릿
      </MenuItem>
    </MenuContainer>
  );
};

export default MenuBar;



