import React, { useState } from 'react';
import MessageInput from '../components/MessageInput';
import MessageGenerate from '../components/MessageGenerate';
import KeywordInput from '../components/KeywordInput';
import ResultDisplay from '../components/ResultDisplay';
import ImageDisplay from '../components/ImageDisplay';
import PageTitle from '../components/PageTitle';
import axios from 'axios';

const AIGenPage = () => {
  const [prompt, setPrompt] = useState(''); // 프롬프트 상태
  const [keywords, setKeywords] = useState([]); // 키워드 상태 (배열로 변경)
  const [generatedMessage, setGeneratedMessage] = useState(''); // 생성된 메시지 상태
  const [imageSrc, setImageSrc] = useState(''); // 생성된 이미지의 소스를 저장

  const handleGenerateMessage = async (newPrompt) => {
    setPrompt(newPrompt); // 프롬프트 업데이트
    try {
      const response = await axios.post('/GPT/api/create-message', {
        mood: '알아서 결정',
        target: '알아서 결정',
        product: '알아서 결정',
        keyword: keywords.join(', '), // 키워드를 쉼표로 구분하여 사용
        prompt: newPrompt
      });

      if (response.status === 200) {
        console.log(response.data); // 콘솔에 응답 데이터 출력
        setGeneratedMessage(response.data); // 생성된 메시지를 상태에 저장
      }
    } catch (error) {
      console.error("메시지 생성 오류:" + error);
    }
  };

  // 이미지 생성 함수
  const handleGenerateImage = async () => {
    try {
      const response = await axios.post('/SD/api/create-image', {
        initImageURL: '', // 초기 이미지 URL, 나중에 바꿔야 됨
        prompt: prompt // 프롬프트 사용
      });

      if (response.status === 200) {
        setImageSrc(response.data.imageURL); // 응답으로 받은 이미지 URL 설정
      }
    } catch (error) {
      console.error("이미지 생성 오류:" + error);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '25%', padding: '10px' }}>
        <PageTitle />
        <br />
        <MessageGenerate onGenerate={handleGenerateMessage} />
        {/* MessageInput에 generatedMessage와 이미지 생성 핸들러 전달 */}
        <MessageInput 
          value={generatedMessage} 
          onPromptChange={setGeneratedMessage} // 수정된 메시지 상태 업데이트
          onGenerateImage={handleGenerateImage} 
        />
      </div>

      <div style={{ width: '50%', height: '100%', padding: '10px' }}>
        <ImageDisplay imageSrc={imageSrc} /> {/* 이미지 소스 전달 */}
        <KeywordInput onComplete={setKeywords} /> {/* 키워드 상태 업데이트 */}
      </div>

      <div style={{ width: '25%', padding: '10px' }}>
        <ResultDisplay />
      </div>
    </div>
  );
};

export default AIGenPage;
