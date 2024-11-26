// 공용 버튼, 크기 지정은 가져다 쓸때 ButtonContainer로 해줘야 하고 버튼 기본색은 Primary Color
// 설정 가능한 부분이 더 필요하다면 추가하면 됩니다
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SECONDARY_COLOR, PRIMARY_COLOR } from '../style/colors';

const StyledButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: ${props => props.backgroundColor || '#6A1BB3'};
  color: ${props => props.textColor || 'white'};
  overflow: hidden;
  z-index: 1;
  
  &:after {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    direction: rtl;
    z-index: -1;
    background: ${SECONDARY_COLOR};
    transition: all 0.2s ease;
  }

  &:hover {
    color: ${PRIMARY_COLOR};
  }

  &:hover:after {
    left: auto;
    right: 0;
    width: 100%;
  }

  &:active {
    transform: scale(0.98);
    top: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      color: ${props => props.textColor || 'white'};
    }
    &:hover:after {
      width: 0;
    }
    &:active {
      transform: none;
      top: 0;
    }
  }
`;

const Button = ({ 
  text, 
  onClick, 
  backgroundColor, 
  textColor, 
  disabled = false,
  className,
  type = 'button'
}) => {
  return (
    <StyledButton
      onClick={onClick}
      backgroundColor={backgroundColor}
      textColor={textColor}
      disabled={disabled}
      className={className}
      type={type}
    >
      {text}
    </StyledButton>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;