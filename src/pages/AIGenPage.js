import React, { useState } from 'react';
import MessageInput from '../components/MessageInput';
import KeywordInput from '../components/KeywordInput';
import ResultDisplay from '../components/ResultDisplay';
import ImageDisplay from '../components/ImageDisplay';
import PageTitle from '../components/PageTitle';

const AIGenPage = () => {
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%'}}>

      {/* 메시지 입력 */}
      <div style={{ width: '25%', padding: '10px' }}>
        <PageTitle /> <br></br>
        <MessageInput />
      </div>

      {/* 핵심 키워드 */}
      <div style={{ width: '50%', height: '100%', padding: '10px' }}>
      <ImageDisplay imageSrc={imageSrc} />
        <KeywordInput />
      </div>

      {/* 생성 결과 */}
      <div style={{ width: '25%', padding: '10px' }}>
        <ResultDisplay />
        
      </div>
    </div>
  );
};

export default AIGenPage;
