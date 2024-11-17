// src/pages/SignupPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { signup } from '../services/authService';
import Typewriter from 'typewriter-effect';
const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(180deg, #101938 0%, #5D3784 100%);
  color: white;
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
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TypewriterText = styled.div`
  font-size: 34px; /* 폰트 크기 설정 */
  font-weight: bold;
  text-align: center; /* 텍스트 중앙 정렬 */
  margin-bottom: 50px; /* 아래 여백 */
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
  background: #101938;
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
    background: #4947FF;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #fff;
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
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 220px;
  margin-top: 20px;
`;

const SignupPage = ({ setActivePage }) => {
  const [formData, setFormData] = useState({ id: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); // 에러 메시지 관리

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    setError(''); // 기존 에러 초기화

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signup({
        id: formData.id,
        password: formData.password,
      });
      alert('회원가입이 완료되었습니다!');
      setActivePage('LoginPage'); // 성공 시 로그인 페이지로 이동
    } catch (error) {
      setError(error.message); // 에러 메시지 설정
    }
  };

  return (
    <SignupContainer>
      <TypewriterText>
          <Typewriter
          options={{
            strings: ['정보를 입력하세요'],
            autoStart: true,
            loop: false,
            deleteSpeed: Infinity,
          }}
        />
</TypewriterText>
      <FormGroup>
        <Label htmlFor="id">아이디</Label>
        <Input
          type="text"
          placeholder="아이디를 입력해주세요"
          name="id"
          id="id"
          value={formData.id}
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
          value={formData.password}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          type="password"
          placeholder="비밀번호를 확인해주세요"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </FormGroup>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ButtonContainer>

      <CustomButton onClick={handleSignup} disabled={!formData.id || !formData.password || !formData.confirmPassword}>
        완료
      </CustomButton>
      <CustomButton onClick={() => setActivePage('LoginPage')}>뒤로가기</CustomButton>
      </ButtonContainer>
    </SignupContainer>
  );
};

export default SignupPage;
