// src/pages/SignupPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { signup } from '../services/authService';

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #2A2977;
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

const Button = styled.button`
  width: 400px;
  padding: 10px;
  margin-top: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const BackButton = styled(Button)`
  background-color: gray;
  margin-top: 10px;

  &:hover {
    background-color: #555;
  }
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
      <h1 style={{ marginBottom: 50 }}>정보 입력</h1>
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
      <Button onClick={handleSignup} disabled={!formData.id || !formData.password || !formData.confirmPassword}>
        완료
      </Button>
      <BackButton onClick={() => setActivePage('LoginPage')}>뒤로가기</BackButton>

    </SignupContainer>
  );
};

export default SignupPage;
