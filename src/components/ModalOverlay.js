import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  // MessageRequestModal의 z-index는 2
  z-index: 1;
`;

const ModalOverlay = ({ children }) => {
  return <Overlay>{children}</Overlay>;
};

export default ModalOverlay;

