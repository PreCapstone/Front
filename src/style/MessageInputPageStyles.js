// src/style/MessageInputPageStyles.js
import styled, { keyframes } from 'styled-components';

// 타자 효과. 진짜 글자 단위로 주긴 피곤하니까 그냥 width 단위로
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

// 입력 커서 깜빡이는 효과와 사라짐을 하나로 통합
const cursorBlink = keyframes`
  0%, 70% { border-color: #6A1BB3 }
  71%, 100% { border-color: transparent }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const ContentArea = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
`;

export const Title = styled.h2`
  font-size: 3.5em;
  color: #6A1BB3;
  opacity: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid transparent;
  width: 0;
  max-width: max-content;
  margin: 0.2em 0;
`;

export const ContentWrapper = styled.div`
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-in-out;
  width: 100%;
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

  // hover 또는 active 상태일 때의 애니메이션
  &:hover, &.active {
    ${Title}:first-child {
      opacity: 1;
      animation: 
        ${typing} 1s steps(4) forwards,
        ${cursorBlink} 4s linear;  // 통합된 커서 효과
    }

    ${Title}:last-child {
      opacity: 1;
      animation: 
        ${typing} 1s steps(5) forwards,
        ${cursorBlink} 4s linear;  // 통합된 커서 효과
      animation-delay: 1.5s;  // 첫 번째 타이틀 이후 시작
    }

    ${ContentWrapper} {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 3s;  // 타이핑 효과 후 나타남
    }
  }
`;

// 새로 추가된 OverlayDiv, 마우스 딴데 가면 흑백처리 해주는 오버레이
export const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; // 마우스 이벤트가 뒤의 요소들에 전달되도록 함
  background-color: #f0f0f0; // 밝은 회색
  opacity: ${props => props.$show ? 0.5 : 0};
  z-index: 1; // z-index를 낮춤
  transition: opacity 0.5s ease; // 부드러운 투명도 전환 효과
`;