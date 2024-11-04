import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const KeywordInputField = styled.input`
  width: calc(100% - 40px);
  padding: 5px;
  border: 1px solid #ccc;
`;

const AddButton = styled.button`
  width: 30px;
  height: 30px;
  margin-left: 10px;
  background-color: #9B30FF;
  color: white;
  border: none;
  cursor: pointer;
`;

const KeywordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Keyword = styled.div`
  background-color: #e0e0e0;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  margin-left: 5px;
  cursor: pointer;
`;

const KeywordInput = ({ onComplete, keywords }) => {
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleInputChange = (e) => {
    setCurrentKeyword(e.target.value);
  };

  const addKeyword = () => {
    if (currentKeyword.trim() !== '') {
      const newKeywords = [...keywords, currentKeyword];
      setCurrentKeyword('');
      onComplete(newKeywords); 
    }
  };

  const removeKeyword = (index) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    onComplete(newKeywords);
  };

  return (
    <Container>
      <div>
        <h3>핵심 키워드</h3>
        <div style={{ display: 'flex' }}>
          <KeywordInputField
            placeholder="키워드를 입력하세요"
            value={currentKeyword}
            onChange={handleInputChange}
          />
          <AddButton onClick={addKeyword}>+</AddButton>
        </div>
        <KeywordsContainer>
          {keywords.map((keyword, index) => (
            <Keyword key={index}>
              {keyword}
              <RemoveButton onClick={() => removeKeyword(index)}>x</RemoveButton>
            </Keyword>
          ))}
        </KeywordsContainer>
      </div>
    </Container>
  );
};

export default KeywordInput;
