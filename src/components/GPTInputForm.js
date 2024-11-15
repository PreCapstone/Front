// src/components/GPTInputForm.jsx
import React from 'react';
import styled from 'styled-components';

// 입력 폼 전체를 감싸는 컨테이너
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

// 각 입력 필드와 라벨을 그룹화하는 컨테이너
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 입력 필드 라벨 스타일링
const Label = styled.label`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

// 입력 필드 스타일링
const TextField = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6A1BB3;
  }

  &::placeholder {
    color: #999;
  }
`;

// GPT 입력 폼 컴포넌트
const GPTInputForm = () => {
  return (
    <FormContainer>
      <InputGroup>
        <Label>어떤 분위기를 원하시나요?</Label>
        <TextField placeholder="예: 친근한, 전문적인, 유머러스한" />
      </InputGroup>
      <InputGroup>
        <Label>어떤 타겟층이 있나요?</Label>
        <TextField placeholder="예: 20-30대 직장인, 주부" />
      </InputGroup>
      <InputGroup>
        <Label>어떤 제품을 홍보하시나요?</Label>
        <TextField placeholder="예: 화장품, 식품, 의류" />
      </InputGroup>
      <InputGroup>
        <Label>원하는 키워드가 있나요?</Label>
        <TextField placeholder="예: 할인, 신제품, 한정판" />
      </InputGroup>
      <InputGroup>
        <Label>AI에게 전달할 추가 문장이 있나요?</Label>
        <TextField placeholder="추가로 전달하고 싶은 내용을 입력하세요" />
      </InputGroup>
    </FormContainer>
  );
};

export default GPTInputForm;