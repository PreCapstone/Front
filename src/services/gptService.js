// src/services/gptService.js
import axios from 'axios';

/**
 * GPT API 요청을 위한 데이터 포맷팅 및 전송
 * @param {Object} formData - GPT 입력 폼 데이터
 * @returns {Promise<string>} - GPT 응답 메시지
 */
export const createGPTMessage = async (formData) => {
  // formData 유효성 검사
  if (!formData || !formData.mood || !formData.target || !formData.product || !formData.keywords) {
    throw new Error('모든 필드를 입력해주세요.');
  }
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_IP}/GPT/api/create-message`,
      {
        "mood": formData.mood,
        "target": formData.target,
        "product": formData.product,
        "keyword": formData.keywords,
        "prompt": formData.additional || ''
      },
      
    );
    return response.data;
  } catch (error) {
    console.error('GPT 메시지 생성 실패:', error);
    throw new Error('메시지 생성에 실패했습니다.');
  }
};