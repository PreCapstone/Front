import axios from 'axios';

/**
 * 프롬프트 변환
 * @param {string} prompt - 사용자가 입력한 프롬프트
 * @param {string} userId - 사용자 ID
 * @returns {Promise<string>} - 변환된 프롬프트
 */
export const translatePrompt = async (prompt, userId) => {
    const serverIP = process.env.REACT_APP_SERVER_IP;

    if (!serverIP) {
        throw new Error('환경 변수 REACT_APP_SERVER_IP가 설정되지 않았습니다.');
    }

    const url = `${serverIP}/GPT/api/create-sd-prompt`;

    try {
        const response = await axios.post(url, { userPrompt: prompt, id: userId });
        const data = response.data;

        if (data.translatedPrompt) {
            return data.translatedPrompt;
        } else if (typeof data === 'string') {
            return data.trim();
        } else {
            throw new Error('번역된 프롬프트를 가져올 수 없습니다.');
        }
    } catch (error) {
        console.error('프롬프트 변환 실패:', error);
        throw error;
    }
};
