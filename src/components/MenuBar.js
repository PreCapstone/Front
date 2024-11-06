import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: 100vh;
`;

const MenuItem = styled.button`
  padding: 20px;
  font-size: 18px;
  background-color: ${({ active }) => (active ? '#34495e' : 'transparent')};
  color: ${({ active }) => (active ? '#f39c12' : '#ecf0f1')};
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #34495e;
  }
`;

const MenuBar = ({ activePage, setActivePage }) => (
  <MenuContainer>
    <MenuItem active={activePage === 'MessageInput'} onClick={() => setActivePage('MessageInput')}>
      메시지 입력
    </MenuItem>
    <MenuItem active={activePage === 'KeywordSelection'} onClick={() => setActivePage('KeywordSelection')}>
      키워드 선택
    </MenuItem>
    <MenuItem active={activePage === 'Requirements'} onClick={() => setActivePage('Requirements')}>
      요구사항
    </MenuItem>
    <MenuItem active={activePage === 'ImageEditing'} onClick={() => setActivePage('ImageEditing')}>
      이미지 편집
    </MenuItem>
  </MenuContainer>
);

export default MenuBar;



