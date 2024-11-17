import React, { useState } from 'react';
import styled from 'styled-components';
import { login } from '../services/authService';
import logoImage from '../assets/logo.png';
import Typewriter from 'typewriter-effect';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(180deg, #4947FF 0%, #8271FF 100%);
  color: white;
`;

const LogoImage = styled.img`
  width: 500px;
  margin-bottom: 50px;
`;

const FormGroup = styled.div`
  width: 400px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 400px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 220px;
  margin-top: 20px;
`;

const CustomButton = styled.button`
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-radius:20px;
  text-transform: uppercase;
  overflow: hidden;
  color: #fff;
  background: #4947FF;
  border: none;
  cursor: pointer;
  z-index: 1;
  transition: color 0.3s ease;

  &:after {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    direction: rtl;
    z-index: -1;
    background: #EAEAEA;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #4947FF;
  }

  &:hover:after {
    left: auto;
    right: 0;
    width: 100%;
  }

  &:active {
    top: 2px;
  }
`;
const TypewriterText = styled.div`
  font-size: 48px; /* 폰트 크기 설정 */
  font-weight: bold;
  text-align: center; /* 텍스트 중앙 정렬 */
  margin-bottom: 20px; /* 아래 여백 */
`;


const LoginPage = ({ setActivePage }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError('');
    try {
      await login(credentials);
      setActivePage('MessageInput');
    } catch (error) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <LoginContainer>
      <TypewriterText>
        <Typewriter
          options={{
            strings: ['AI와 함께하는 광고 메시지 생성 솔루션'],
            autoStart: true,
            loop: false,
            deleteSpeed: Infinity,
          }}
        />
      </TypewriterText>


      <LogoImage src={logoImage} alt="로고" />

      <FormGroup>
        <Label htmlFor="id">아이디</Label>
        <Input
          type="text"
          placeholder="아이디를 입력해주세요"
          name="id"
          id="id"
          value={credentials.id}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
        />
      </FormGroup>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ButtonContainer>
        <CustomButton onClick={handleLogin}>로그인</CustomButton>
        <CustomButton onClick={() => setActivePage('SignupPage')}>회원가입</CustomButton>
      </ButtonContainer>
    </LoginContainer>
  );
};

export default LoginPage;
