// MessageInputPageStyles.js
import styled, { keyframes } from 'styled-components';

// 글자수보단 그냥 width 기준으로
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

// 커서 관련
const cursorBlink = keyframes`
  0%, 70% { border-color: #6A1BB3 }
  71%, 100% { border-color: transparent }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; // 스크롤 방지
`;

export const ContentArea = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
`;

// 여러 Title 한 번에 관리하는 title container
export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 50px auto;
  width: 100%;  // 컨테이너의 전체 너비 설정
  padding: 0 20px;  // 좌우 패딩 추가
`;

export const Title = styled.h2`
  font-size: 4.5em;
  color: #6A1BB3;
  opacity: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid transparent;
  width: 0;
  // 이게 꼭 있어야 안드로메다 가는 커서 방지됨
  max-width: max-content;
  margin: 0.2em 0;
`;

export const HintText = styled.h2`
  position: absolute;
  right: 20px;
  top: 32.5%;
  transform: translateY(-50%);
  opacity: 0;
  z-index: 1;
`;

export const ContentWrapper = styled.div`
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-in-out;
  width: calc(100% - 40px); // 좌우 여백 20px씩 확보
  margin: 0 20px; // 좌우 마진 추가
`;

export const Pane = styled.div`
  width: 50%;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.isActive ? 'rgba(106, 27, 179, 0.05)' : 'transparent'};

  &:hover, &.active {
    ${Title}:first-child {
      opacity: 1;
      animation: 
        ${typing} 1.5s steps(11) forwards,
        ${cursorBlink} 1.5s linear;
    }

    ${Title}:last-child {
      opacity: 1;
      animation: 
        ${typing} 1.5s steps(15) forwards,
        ${cursorBlink} 3s linear;
      animation-delay: 1.5s;
    }

    ${ContentWrapper} {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 3s;
    }

    ${HintText} {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 4s;
    }
  }
`;

export const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-color: #f0f0f0;
  opacity: ${props => props.$show ? 0.5 : 0};
  z-index: 1;
  transition: opacity 0.5s ease;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  padding: 20px;
  margin-top: auto; // Pane 하단에 고정
`;