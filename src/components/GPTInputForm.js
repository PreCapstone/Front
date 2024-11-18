// src/components/GPTInputForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { PRIMARY_COLOR } from '../style/colors';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
`;

const Label = styled.label`
  font-size: 0.85vw; 
  color: #333;
  font-weight: 500;
`;

const TextField = styled.input`
  width: 100%;
  padding: 1vh 1vw;
  border: 0.1vh solid #E0E0E0;
  border-radius: 0.5vw;
  font-size: 0.8vw;
  
  &:focus {
    outline: none;
    border-color: #6A1BB3;
  }

  &::placeholder {
    color: #999;
  }
`;

const inputFields = [
  {
    id: 'mood',
    label: '어떤 분위기를 원하시나요?',
    placeholder: '예: 친근한, 전문적인, 유머러스한'
  },
  {
    id: 'target',
    label: '어떤 타겟층이 있나요?',
    placeholder: '예: 20-30대 직장인, 주부'
  },
  {
    id: 'product',
    label: '어떤 제품을 홍보하시나요?',
    placeholder: '예: 화장품, 식품, 의류'
  },
  {
    id: 'keywords',
    label: '원하는 키워드가 있나요?',
    placeholder: '예: 할인, 신제품, 한정판'
  },
  {
    id: 'additional',
    label: 'AI에게 전달할 추가 문장이 있나요?',
    placeholder: '추가로 전달하고 싶은 내용을 입력하세요'
  }
];

const ButtonContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const GPTInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    mood: '',
    target: '',
    product: '',
    keywords: '',
    additional: ''
  });

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <FormContainer>
      {inputFields.map(field => (
        <InputGroup key={field.id}>
          <Label htmlFor={field.id}>{field.label}</Label>
          <TextField
            id={field.id}
            value={formData[field.id]}
            placeholder={field.placeholder}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        </InputGroup>
      ))}
      <ButtonContainer>
        <Button 
          text="메시지 자동 생성"
          onClick={() => onSubmit(formData)}
          backgroundColor={ PRIMARY_COLOR }
        />
      </ButtonContainer>
    </FormContainer>
  );
};

export default GPTInputForm;