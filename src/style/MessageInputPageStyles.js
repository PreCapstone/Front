// styled-components를 사용하여 스타일을 정의하는 파일
// styled-components는 "CSS-in-JS" 방식의 한 종류
// JavaScript 파일 내에서 CSS를 작성하는 접근 방식
// 안 쓰고 일반 css 방식 썼으면 아마 다 클래스 명으로 접근했을 거임 

// vw, vh : 브라우저 크기. 부모 크기 무시!!
// em, rem : em은 부모 크기 비례, rem은 루트 조상 크기 비례. 내가 손자면 em은 두 번 적용되지만 rem은 한 번만 적용됨. (em은 부모의 크기를 곱해서 계산하고 rem은 기본값을 곱해서 계산. rem 쓰는 게 훨씬 편해보임)
// % : 부모 요소의 몇%
// vw vh는 스크롤바도 뷰포트로 보기 떄문에 추가적인 영역을 그려서 스크롤해서 봐야할수도 있음, %는 안 그럼.

import styled, { keyframes } from 'styled-components';
import { PRIMARY_COLOR } from '../style/colors';

// 글자수보단 그냥 width 기준으로 하자... 
// keyframe는 styled components 함수, css의 @keyframes 가져온 거. 
// typing은 변수긴 한데 css 애니메이션을 표현하는 변수임? 쩄든 width 0에서 100%까지. from/to도 문법임
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

// 커서 관련
const cursorBlink = keyframes`
  0%, 50% { border-color: #6A1BB3 }
  51%, 100% { border-color: transparent }
`;

// 제일 바깥 컨테이너부터. 메뉴바 제외하고 width 100%
export const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

export const ContentArea = styled.div`
  display: flex;
  height: 100%;
  width: 100%
`;

// 여러 Title 한 번에 관리하는 title container. 마진은 상 우 하 좌 순서였던 걸로 기억
export const TitleContainer = styled.div`
display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 3.125rem;
  width: 100%;
  padding: 0 1.25rem;
`;

export const Title = styled.h2`
  font-size: 3.75vw;
  color: ${PRIMARY_COLOR};
  opacity: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid transparent;
  width: 0;
  // 이게 꼭 있어야 안드로메다 가는 커서 방지됨
  max-width: max-content;
  margin: 0.9rem 0;
`;

// 잘 안 떠오른다면-> 부분
export const HintText = styled.h2`
  font-size: 1.28vw;
  margin: 0 0 0 70%;
  transform: translateY(-50%);
  opacity: 0;
`;

export const ContentWrapper = styled.div`
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-in-out;
  width: calc(100% - 40px); // 좌우 여백 20px씩 확보
  margin: 0 1.7em 0 0 ; // 좌우 마진 추가
`;

// 애니메이션 때문에 얜 밑으로 (초기화 전 접근 불가 문제)
export const Pane = styled.div`
  width: 50%;
  padding: 1.25rem 1.25rem 1.25rem 2.25rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.isActive ? 'rgba(106, 27, 179, 0.05)' : 'transparent'};

  //애니메이션 부분. opacity 다 기본적으로 0으로 주고, 일정 시간 지난 후 1로 바꿔서 나타나게 하는 방식임
  // child는 제목 첫줄이랑 둘째줄 얘기임 (메시지를 / 입력하세요)
  // 1.5 steps(11) : 1.5초동안 11단계를 거쳐서 진행
  // forwards : 마지막 키프레임 스타일 유지 (불투명했다면 계속 불투명하게) <-> backwards
  // 0.7s step-end 3 : 0.7초 애니메이션 3번 반복, 단계 끝에서 갑작스럽게 바뀌기(step-end) <-> step-start
  // 참고 키워드 > infinite : 무한반복. linear: 일정 속도로 진행. ease 관련 : 중간에 속도 변화.
  
  &:hover, &.active {
    ${Title}:first-child {
      opacity: 1;
      animation: 
        ${typing} 0.7s steps(11) forwards,
        ${cursorBlink} 0.3s step-end 3;
    }

    ${Title}:last-child {
      opacity: 1;
      animation: 
        ${typing} 0.7s steps(15) forwards,
        ${cursorBlink} 0.3s step-end 3;
      animation-delay: 0.7s;
    }

    ${ContentWrapper} {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 1.4s;
    }

    ${HintText} {
      opacity: 1;
      transform: translateY(0);
      transition-delay: 2.4s;
    }
  }
`;

export const ButtonGroup = styled.div`
  gap: 1rem;
`;

// mousehover 사라졌을 때 해당 ui 흐릿하게 보이게 하기 위한 오버레이임
// $show props로 받지만 명시되지 않음 > styled-components는 모든 props를 자동으로 받아들이게 설계돼있어서 그런 거
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