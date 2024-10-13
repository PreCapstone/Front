import React, { useState } from 'react';

function KeywordInput({ keywords, setKeywords }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue)) {
      setKeywords([...keywords, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  return (
    <div className="keyword-input">
      <h3>핵심 키워드</h3>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="키워드를 입력하세요"
      />
      <button onClick={handleAddKeyword}>+</button>
      <div className="keyword-list">
        {keywords.map(keyword => (
          <div key={keyword} className="keyword">
            {keyword} <button onClick={() => handleRemoveKeyword(keyword)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KeywordInput;
