// src/pages/AIGenPage.js
import React, { useState } from 'react';
import MessageInput from '../components/MessageInput';
import KeywordInput from '../components/KeywordInput';
import ImageDisplay from '../components/ImageDisplay';
import PageTitle from '../components/PageTitle';
import MessageGenerate from '../components/MessageGenerate';
import { generateImage } from '../services/imageService';
import { generateGPTMessage } from '../services/gptService';

const AIGenPage = ({ imageSrc, setImageSrc }) => {
  const [keywords, setKeywords] = useState([]);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleGenerateImage = async () => {
    const imageUrl = await generateImage(prompt);
    setImageSrc(imageUrl);
  };

  const handleGenerateMessage = async (promptText) => {
    const message = await generateGPTMessage(promptText);
    setGeneratedMessage(message);
    setPrompt(message); // 생성된 메시지를 prompt로 설정
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '25%', padding: '10px' }}>
        <PageTitle />
        <MessageGenerate onGenerate={handleGenerateMessage} />
        <MessageInput 
          value={generatedMessage} 
          onPromptChange={setPrompt}
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
