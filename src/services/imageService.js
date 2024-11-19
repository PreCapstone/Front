import axios from 'axios';

/**
 * Stable Diffusion API 호출
 * @param {Object} params - 이미지 생성 요청 데이터
 * @param {string} params.prompt - 생성할 이미지에 대한 설명
 * @param {string} params.initImage - 초기 이미지 URL
 * @returns {Promise<string>} - 생성된 이미지 URL
 */
export const generateImage = async ({ prompt, initImage }) => {
  const serverIP = process.env.REACT_APP_SERVER_IP;

  if (!serverIP) {
    throw new Error('환경 변수 REACT_APP_SERVER_IP가 설정되지 않았습니다.');
  }

  const apiUrl = `${serverIP}/SD/api/create-image`;

  const id = sessionStorage.getItem('userId') || '1'; // 기본값을 '1'로 설정

  if (!initImage) {
    throw new Error('initImage가 제공되지 않았습니다.');
  }

  if (!prompt) {
    throw new Error('prompt가 제공되지 않았습니다.');
  }

  try {
    console.log('이미지 생성 요청:', { id, prompt, initImage });
    const response = await axios.post(apiUrl, { id, prompt, initImage }); // userId 대신 id 사용
    console.log('이미지 생성 성공:', response.data);
    return response.data.uploadedImageUrl;
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    throw new Error('이미지 생성 실패');
  }
};
