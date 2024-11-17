// components/KeywordInput.jsx
import React from 'react';
import { InputContainer, InputField, AddButton } from '../styles/inputs';

const KeywordInput = ({ inputKeyword, setInputKeyword, onAdd }) => (
  <InputContainer>
    <InputField
      placeholder="키워드를 입력하세요"
      value={inputKeyword}
      onChange={(e) => setInputKeyword(e.target.value)}
    />
    <AddButton onClick={onAdd}>+</AddButton>
  </InputContainer>
);

export default KeywordInput;