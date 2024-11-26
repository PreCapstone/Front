// 키워드 입력 받는 부분, 입력시 상태 업데이트 / 추가버튼 누르면 키워드 추가 처리 (onAdd)
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