import React from 'react';
import styled from 'styled-components';
import { FaPen, FaTags, FaClipboardList, FaImage } from 'react-icons/fa'; // 아이콘 추가
import logo from '../assets/new_logo_vertical.png';
import { logout } from '../services/authService';
import { SECONDARY_COLOR } from '../style/colors';
import { OTHER_COLOR } from '../style/colors';
import logoImage from '../assets/logo.png';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 15vw; /* 반응형에 맞춰 넓이 조정 */
  background:#333333; 
  color: white;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  padding-top: 1rem;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  padding: 1.25rem;
  font-size: 1.125rem;
  font-weight : bold;
  display: flex;
  align-items: center;
  gap: 1rem; 
  background-color: ${({ active }) => (active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  border-radius: 20px;
  color: ${({ active }) => (active ? SECONDARY_COLOR : '#ecf0f1')};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: ${SECONDARY_COLOR};
  }
`;

const MenuTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ecf0f1;
  font-weight: bold;
`;

const BottomSection = styled.div`
  margin-top: auto;
  text-align: center;
  padding: 0;
`;

const LogoImage = styled.img`
  width: 80%; /* 로고 크기 조정 */
  // max-width: 100px;
  margin: 0 auto;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.2)); /* 로고에 약간의 그림자 */
`;

const LogoutButton = styled(MenuItem)`
  background-color: ${ OTHER_COLOR };
  justify-content: center;
  &:hover {
    background-color: #e74c3c;
  }
  width: 100%;
`;

const MenuBar = ({ activePage, setActivePage, setGeneratedImage }) => {
  const handleLogout = () => {
    logout(); // 세션에서 토큰 제거
    setActivePage('LoginPage'); // 로그인 페이지로 이동
  };

  const handleImageEditing = () => {
    const defaultImage = logoImage; // 기본 이미지 URL (또는 로컬 경로)
    setGeneratedImage(defaultImage); // 기본 이미지를 설정
    setActivePage('ImageEditingPage'); // 이미지 편집 페이지로 이동
  };

  return (
    <MenuContainer>
      <TopSection>
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
        <MenuItem active={activePage === 'ImageEditing'} onClick={handleImageEditing}>
          <FaImage /> 이미지 편집
        </MenuItem>
      </TopSection>

      <BottomSection>
        <LogoImage src={logo} />
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
      </BottomSection>
    </MenuContainer>
  );
};

export default MenuBar;
