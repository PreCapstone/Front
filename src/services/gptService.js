import axios from 'axios';

/**
 * GPT 메시지 생성 API 호출
 * @param {string} prompt - 사용자 요청
 * @returns {Promise<string>} - GPT가 생성한 메시지
 */
export const generateGPTMessage = async (prompt) => {
  try {
    const response = await axios.post('/api/generate-message', { prompt });
    return response.data.message;
  } catch (error) {
    console.error('GPT 메시지 생성 실패:', error);
    throw new Error('메시지 생성 실패');
  }
};
