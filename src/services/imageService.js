import axios from 'axios';

/**
 * Stable Diffusion API 호출
 * @param {Object} params - 이미지 생성 요청 데이터
 * @param {string} params.prompt - 생성할 이미지에 대한 설명
 * @param {string} params.initImage - 초기 이미지 URL
 * @returns {Promise<string>} - 생성된 이미지 URL
 */
export const generateImage = async ({ prompt, initImage, negativePrompt }) => {
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
    const payload = {
      id,
      prompt,
      initImage,
      negativePrompt,
    };

    console.log('최종 요청 데이터:', payload); // 요청 데이터 로깅

    const response = await axios.post(apiUrl, payload);

    console.log('이미지 생성 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('이미지 생성 실패:', error);
    throw new Error('이미지 생성 실패');
  }
};

/**
 * 사용자 생성 이미지 가져오기
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object[]>} - 이미지 목록 (userImage, sampleImage, prompt, createdAt 포함)
 */
export const getUserImages = async (userId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_IP}/user/get-images`, {
      params: { USER_ID: userId }, // 요청 파라미터 설정
    });
    return response.data; // 성공 시 데이터 반환
  } catch (error) {
    console.error('Error fetching user images:', error);
    throw error; // 에러 발생 시 호출한 쪽에서 처리하도록 에러 전달
  }
};