// components/KeywordList.jsx
import React from 'react';
import { KeywordContainer, KeywordItem, RemoveButton } from '../styles/keywords';

const KeywordList = ({ keywords, onRemove }) => (
  <KeywordContainer>
    {keywords.map((keyword, index) => (
      <KeywordItem key={index}>
        #{keyword}
        <RemoveButton onClick={() => onRemove(keyword)}>X</RemoveButton>
      </KeywordItem>
    ))}
  </KeywordContainer>
);

export default KeywordList;