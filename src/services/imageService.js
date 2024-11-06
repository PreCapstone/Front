import axios from 'axios';

/**
 * Stable Diffusion API 호출
 * @param {string} prompt - 이미지 생성 요청
 * @returns {Promise<string>} - 생성된 이미지 URL
 */
export const generateImage = async (prompt) => {
  try {
    const response = await axios.post('/api/stable-diffusion', { prompt });
    return response.data.imageURL;
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    throw new Error('이미지 생성 실패');
  }
};

