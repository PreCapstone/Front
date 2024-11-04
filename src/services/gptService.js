// src/services/gptService.js
import axios from 'axios';

export const generateGPTMessage = async (prompt) => {
  try {
    const response = await axios.post('/gpt/api/create-message', { prompt });
    return response.data.message;
  } catch (error) {
    console.error("GPT 메시지 생성 오류:", error);
    return null;
  }
};
