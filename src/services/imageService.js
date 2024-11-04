// src/services/imageService.js
import axios from 'axios';

export const generateImage = async (prompt) => {
  try {
    const response = await axios.post('/SD/api/create-image', { prompt });
    return response.data.imageURL;
  } catch (error) {
    console.error("이미지 생성 오류:", error);
    return null;
  }
};
