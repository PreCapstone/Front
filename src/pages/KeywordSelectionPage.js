import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 95vh; /* 세로 높이를 약간 줄임 */
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputField = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddButton = styled.button`
  padding: 10px 15px;
  background-color: #6a1bb3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #531299;
  }
`;

const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  max-height: 60%; /* 컨테이너 높이 제한 */
  overflow-y: auto;
`;

const KeywordItem = styled.div`
  background-color: #e0e0e0;
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: red;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
`;

const NavigationButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ primary }) => (primary ? '#6a1bb3' : '#ddd')};
  color: ${({ primary }) => (primary ? 'white' : 'black')};
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${({ primary }) => (primary ? '#531299' : '#bbb')};
  }
`;

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
      <h2>키워드 선택</h2>
      <InputContainer>
        <InputField
          placeholder="키워드를 입력하세요"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
        />
        <AddButton onClick={handleAddKeyword}>+</AddButton>
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
        <NavigationButton onClick={() => setActivePage('MessageInput')}>← 이전</NavigationButton>
        <NavigationButton primary onClick={() => setActivePage('Requirements')}>
          선택 완료 →
        </NavigationButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default KeywordSelectionPage;

