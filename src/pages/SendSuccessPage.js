import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import styled from 'styled-components';
import paperPlane from '../assets/paperplane_colored.png';
import { SECONDARY_COLOR, PRIMARY_COLOR, OTHER_COLOR } from '../style/colors';
import Button from '../components/Button';
import { logout } from '../services/authService';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 2.5vw;
  color: ${PRIMARY_COLOR};
  white-space: nowrap;
  margin: 1.9rem 0.5rem 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

// const Button = styled.button`
// const StyledButton = styled(Button)`
const StyledButton = styled(Button)`
  && {
    font-size: 1.5rem;
    padding: 1rem 0.5rem;
    min-width: 150px;
    background-color : ${OTHER_COLOR};
  }
`;

const CircleFrame = styled.div`
  width: 20vw;
  height: 20vw;
  max-width: 200px;
  max-height: 200px;
  border-radius: 50%;
  background-color: ${SECONDARY_COLOR};
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaperPlane = styled(motion.img)`
  width: 60%;
  height: auto;
  object-fit: contain;
`;

const SendSuccessPage = ({ setActivePage, resetMessage }) => {
  const [isAnimating, setIsAnimating] = useState(false);

// framer motion > vh vw 가능 default px
  const flyingVariants = {
    initial: { 
      x: 0, 
      y: 0, 
      rotate: 0,
      opacity: 1 
    },
    animate: {
      x: [0, -25, 120],
      y: [0, 25, -110],
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      }
    },
    reset: {
      x: -120,
      y: 110,
      opacity: 0,
      transition: {
        duration: 0
      }
    },
    reappear: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: .5,
        ease: "easeOut"
      }
    }
  };

  // setTimeout(() => {
  //   console.log("3초 후 실행됨");
  // }, 3000);

  const animate = () => {
    setIsAnimating(true); //비행기 날아옴, 상태 animate
    setTimeout(() => { // 0.9초 후 타임아웃
      setIsAnimating('reset'); // 다음 애니메이션
      setTimeout(() => {
        setIsAnimating('reappear');
        setTimeout(() => {
          setIsAnimating(false);
          setTimeout(() => {animate();}, 1 * 1000);
        }, .5 * 1000);
      }, .1 * 1000);
    }, 0.9 * 1000); // 0.7(처음 날아가는 시간)보다 조금 여유롭게
  };

  // 컴포넌트가 마운트되면 애니메이션 시작
  useEffect(() => {
    animate();
  }, []);

  return (
    <Container>
      <ContentWrapper>
        <CircleFrame>
          <PaperPlane
            src={paperPlane}
            alt="Paper Plane"
            variants={flyingVariants}
            initial="initial"
            animate={
              isAnimating === true ? "animate" : 
              isAnimating === 'reset' ? "reset" :
              isAnimating === 'reappear' ? "reappear" : 
              "initial"
            }
          />
        </CircleFrame>
        <Title> 전송 완료! </Title>
        <ButtonContainer>
          <StyledButton 
            onClick={logout} 
            text="로그아웃"
            backgroundColor={PRIMARY_COLOR}
          />
          <StyledButton 
            onClick={() => {
              console.log('resetMessage:', resetMessage); // undefined가 아닌 "function"이어야 함
              console.log(typeof resetMessage);
              resetMessage();
              setActivePage('MessageInput');
            }}  
            text="처음으로"
            backgroundColor={PRIMARY_COLOR}
          />
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
}

export default SendSuccessPage;