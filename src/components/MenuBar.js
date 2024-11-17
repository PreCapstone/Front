import React from 'react';
import styled from 'styled-components';
import { FaPen, FaTags, FaClipboardList, FaImage } from 'react-icons/fa'; // 아이콘 추가
import logo from '../assets/logo.png';
const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 15vw; /* 반응형에 맞춰 넓이 조정 */
  background: linear-gradient(180deg, #4947FF 0%, #5D3784 100%);
  color: white;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  padding-top: 1rem;
`;

const MenuItem = styled.button`
  padding: 1.25rem;
  font-size: 1.125rem;
  font-weight : bold;
  display: flex;
  align-items: center;
  gap: 1rem; 
  background-color: ${({ active }) => (active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  color: ${({ active }) => (active ? '#FFC312' : '#ecf0f1')};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #FFC312;
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ecf0f1;
  font-weight: bold;
`;
const LogoContainer = styled.div`
  // text-align: center;
  margin-top: auto;
  margin-bottom:20px;
`;

const LogoImage = styled.img`
  width: 80%; /* 로고 크기 조정 */
  // max-width: 100px;
  margin: 0 auto;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.2)); /* 로고에 약간의 그림자 */
`;

const MenuBar = ({ activePage, setActivePage }) => (
  <MenuContainer>
    <MenuTitle>메뉴</MenuTitle>
    <MenuItem active={activePage === 'MessageInput'} onClick={() => setActivePage('MessageInput')}>
      <FaPen /> 메시지 입력
    </MenuItem>
    <MenuItem active={activePage === 'KeywordSelection'} onClick={() => setActivePage('KeywordSelection')}>
      <FaTags /> 키워드 선택
    </MenuItem>
    <MenuItem active={activePage === 'Requirements'} onClick={() => setActivePage('Requirements')}>
      <FaClipboardList /> 요구사항
    </MenuItem>
    <MenuItem active={activePage === 'ImageEditing'} onClick={() => setActivePage('ImageEditing')}>
      <FaImage /> 이미지 편집
    </MenuItem>
    <LogoContainer>
      <LogoImage src={logo}  />
    </LogoContainer>

  </MenuContainer>
);

export default MenuBar;
