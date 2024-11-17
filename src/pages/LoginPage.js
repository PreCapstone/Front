// src/pages/LoginPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { login } from '../services/authService';
import logoImage from '../assets/logo.png'

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #2A2977;
  color: white;
`;

const LogoImage = styled.img`
  width: 500px;  // 이미지 너비 설정
  margin-bottom: 50px;  // 이미지와 입력 필드 간 간격
`;

const FormGroup = styled.div`
  width: 400px;
  margin-bottom: 5px;
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

const LoginButton = styled.button`
  width: 400px;
  padding: 10px;
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const SignupButton = styled.button`
  width: 400px;
  padding: 10px;
  margin-top: 10px;
  background-color: white;
  color: #3498db;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #DDDDDD;
  }
`;

const LoginPage = ({ setActivePage }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState(''); // 에러 메시지 관리

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError(''); // 기존 에러 초기화

    try {
      await login(credentials); // 로그인 API 호출
      setActivePage('MessageInput'); // 로그인 성공 시 메시지 입력 페이지로 이동
    } catch (error) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.'); // 에러 메시지 설정
    }
  };

  return (
    <LoginContainer>
      <LogoImage src={logoImage} alt="로고" /> {/* 이미지 추가 */}
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
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <SignupButton onClick={() => setActivePage('SignupPage')}>회원가입</SignupButton>
    </LoginContainer>
  );
};

export default LoginPage;
