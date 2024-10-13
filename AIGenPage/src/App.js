import React, { useState } from 'react';
import './App.css'; // 필요하다면 스타일을 위한 CSS 파일
//npm start

const App = () => {
  const [byteCount, setByteCount] = useState(0); // 메시지 바이트 카운트 상태 관리
  const [keywords, setKeywords] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');

  const handleTextChange = (e) => {
    setByteCount(e.target.value.length);
  };

  const addKeyword = () => {
    if (inputKeyword.trim()) {
      setKeywords([...keywords, inputKeyword.trim()]);
      setInputKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '10px' }}>
      {/* 1. Menu Bar */}
      <div style={{ width: '15%', backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'center' }}>
        <MenuBar />
      </div>

      {/* 2. Message Input */}
      <div style={{ width: '25%', padding: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <h2>AI 자동 생성</h2>
          <p>AI가 입력된 메시지를 분석하여 이미지를 생성합니다.</p>
          <br></br>
          <h2>메시지 입력</h2>
        </div>
        <textarea 
          placeholder="메시지를 입력해주세요." 
          style={{ width: '100%', height: '150px' }} 
          onChange={handleTextChange}
        />
        <p style={{ textAlign: 'right' }}>{byteCount}/2000byte</p>
        <div style={{ textAlign: 'right' }}>
          <button style={{ marginTop: '10px', padding: '5px 20px' }}>AI 자동 생성</button>
        </div>
      </div>

      {/* 3. Key Words + Image Box */}
      <div style={{ width: '30%', padding: '10px' }}>
        <div style={{ height: '50%', border: '2px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>이미지 선택</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>핵심 키워드</h3>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder="키워드를 입력하세요" 
              style={{ flex: '1', marginRight: '5px' }} 
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
            <button onClick={addKeyword}>+</button>
          </div>
          <div>
            {keywords.map((keyword, index) => (
              <div key={index} style={{ display: 'inline-block', margin: '5px', padding: '5px', border: '1px solid #ccc' }}>
                {keyword} <button onClick={() => removeKeyword(keyword)}>x</button>
              </div>
            ))}
          </div>
          <button style={{ padding: '5px 20px', marginTop: '10px', display: 'block' }}>제작완료</button>
        </div>
      </div>

      {/* 4. Generated Results */}
      <div style={{ width: '30%', padding: '10px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>생성 결과</p>
      </div>
    </div>
  );
};

const MenuBar = () => (
  <>
    <div style={{ padding: '20px 0', cursor: 'pointer' }}>
      <i className="icon-ai" /> {/* 아이콘 라이브러리로 교체 필요 */}
      <p>AI 자동 생성</p>
    </div>
    <div style={{ padding: '20px 0', cursor: 'pointer' }}>
      <i className="icon-photo" /> {/* 아이콘 라이브러리로 교체 필요 */}
      <p>내 사진</p>
    </div>
    <div style={{ padding: '20px 0', cursor: 'pointer' }}>
      <i className="icon-template" /> {/* 아이콘 라이브러리로 교체 필요 */}
      <p>추천 템플릿</p>
    </div>
  </>
);

export default App;
