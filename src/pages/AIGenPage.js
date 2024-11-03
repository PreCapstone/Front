// src/pages/AIGenPage.js
import React from 'react';
import MessageInput from '../components/MessageInput';
import MessageGenerate from '../components/MessageGenerate';
import KeywordInput from '../components/KeywordInput';
import ImageDisplay from '../components/ImageDisplay';
import PageTitle from '../components/PageTitle';

const AIGenPage = ({
  imageSrc,
  generatedMessage,
  handleGenerateMessage,
  handleGenerateImage,
  keywords,
  setKeywords
}) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '25%', padding: '10px' }}>
        <PageTitle />
        <br />
        <MessageGenerate onGenerate={handleGenerateMessage} />
        <MessageInput 
          value={generatedMessage} 
          onPromptChange={handleGenerateMessage}
          onGenerateImage={handleGenerateImage} 
        />
      </div>

      <div style={{ width: '50%', height: '100%', padding: '10px' }}>
        <ImageDisplay imageSrc={imageSrc} />
        <KeywordInput onComplete={setKeywords} keywords={keywords} />
      </div>

      <div style={{ width: '25%', padding: '10px' }}>
        <h2>생성 결과</h2>
      </div>
    </div>
  );
};

export default AIGenPage;
