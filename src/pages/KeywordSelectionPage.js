// components/KeywordSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import Button from '../components/Button.js';
import {
  PageContainer,
  InputContainer,
  InputField,
  KeywordContainer,
  KeywordItem,
  RemoveButton,
  ButtonContainer,
  PageTitle
} from '../style/KeywordSelectionPageStyles';

const KeywordSelectionPage = ({ message, setActivePage }) => {
  const [keywords, setKeywords] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');

  useEffect(() => {
    if (message) {
      const extractedKeywords = extractKeywordsFromMessage(message);
      setKeywords(extractedKeywords);
    }
  }, [message]);

  const extractKeywordsFromMessage = (text) => {
    const words = text.split(/\s+/);
    return Array.from(new Set(words.filter((word) => word.length > 1)));
  };

  const handleAddKeyword = () => {
    if (inputKeyword.trim() && !keywords.includes(inputKeyword)) {
      setKeywords([...keywords, inputKeyword.trim()]);
      setInputKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <PageContainer>
      <PageTitle>키워드 선택</PageTitle>
      <InputContainer>
        <InputField
          placeholder="키워드를 입력하세요"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
        />
        <Button 
          text="+" 
          onClick={handleAddKeyword} 
          backgroundColor="#6a1bb3"
        />
      </InputContainer>
      <KeywordContainer>
        {keywords.map((keyword, index) => (
          <KeywordItem key={index}>
            #{keyword}
            <RemoveButton onClick={() => handleRemoveKeyword(keyword)}>X</RemoveButton>
          </KeywordItem>
        ))}
      </KeywordContainer>
      <ButtonContainer>
        <Button 
          text="← 이전" 
          onClick={() => setActivePage('MessageInput')} 
          backgroundColor="#ddd"
          textColor="#333"
        />
        <Button 
          text="선택 완료 →" 
          onClick={() => setActivePage('Requirements')} 
          backgroundColor="#6a1bb3"
        />
      </ButtonContainer>
    </PageContainer>
  );
};

export default KeywordSelectionPage;