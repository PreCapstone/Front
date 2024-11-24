import React, { useState } from 'react';
import { motion } from "framer-motion";
import styled from 'styled-components';
import paperPlane from '../assets/paperplane.png';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const CircleFrame = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #e6f8f5;
  overflow: hidden;
  position: relative;
`;

const PaperPlane = styled(motion.img)`
  width: 200px;
  height: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
`;

const SendSuccessPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const flyingVariants = {
    initial: { 
      x: 0, 
      y: 0, 
      rotate: 0,
      opacity: 1 
    },
    animate: {
      x: [0, -30, window.innerWidth],
      y: [0, 30, -window.innerHeight],
      opacity: 0,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    },
    reset: {
      x: -window.innerWidth,
      y: window.innerHeight,
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleSend = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating('reset');
      setTimeout(() => {
        setIsAnimating('reappear');
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }, 100);
    }, 2000);
  };

  return (
    <Container>
      <div>
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
        <Button onClick={handleSend}>버튼</Button>
      </div>
    </Container>
  );
};

export default SendSuccessPage;