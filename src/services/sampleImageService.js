import axios from 'axios';

/**
 * 샘플 이미지 가져오기
 * @returns {Promise<string[]>} - 샘플 이미지 URL 배열
 */
export const fetchSampleImages = async () => {
    const serverIP = process.env.REACT_APP_SERVER_IP;

    if (!serverIP) {
        throw new Error('환경 변수 REACT_APP_SERVER_IP가 설정되지 않았습니다.');
    }

    const url = `${serverIP}/get-sample`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (Array.isArray(data)) {
            return data;
        } else {
            throw new Error('서버 응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('샘플 이미지를 가져오는 데 실패했습니다:', error);
        throw error;
    }
};
