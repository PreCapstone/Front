import axios from 'axios';

/**
 * 사용자 이미지 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} userId - 사용자 ID
 * @returns {Promise<string>} - 업로드된 이미지 URL
 */
export const uploadUserImage = async (file, userId) => {
    const serverIP = process.env.REACT_APP_SERVER_IP;

    if (!serverIP) {
        throw new Error('환경 변수 REACT_APP_SERVER_IP가 설정되지 않았습니다.');
    }

    const url = `${serverIP}/user/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', userId);

    try {
        const response = await axios.post(url, formData);
        return response.data; // 업로드된 이미지의 URL 반환
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
    }
};
