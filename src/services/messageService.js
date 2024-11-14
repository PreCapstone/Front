import axios from 'axios';

/**
 * SMS 전송 API 호출
 * @param {string} recipient - 수신자 번호
 * @param {string} message - 전송할 메시지
 * @returns {Promise} - API 응답
 */
export const sendSMS = async (recipient, message) => {
  try {
    const response = await axios.post('/api/send-sms', { recipient, message });
    return response.data;
  } catch (error) {
    console.error('SMS 전송 실패:', error);
    throw error;
  }
};

/**
 * MMS 전송 API 호출
 * @param {string} recipient - 수신자 번호
 * @param {string} message - 전송할 메시지
 * @returns {Promise} - API 응답
 */
export const sendMMS = async (recipient, message) => {
  try {
    const response = await axios.post('/api/send-mms', { recipient, message });
    return response.data;
  } catch (error) {
    console.error('MMS 전송 실패:', error);
    throw error;
  }
};
