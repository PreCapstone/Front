import axios from 'axios';

/**
 * SMS 전송 API 호출
 * @param {string} recipient - 수신자 번호
 * @param {string} message - 전송할 메시지
 * @returns {Promise} - API 응답
 */
export const sendSMS = async (recipient, message, changeWords = {}) => {
  try {
    const requestBody = {
      content: message,          // 메시지 내용
      duplicateFlag: 'N',        // 중복 제거
      targetCount: 1,            // 수신자 수
      targets: [
        {
          to: recipient,         // 수신자 번호
          name: '고객',           // 기본 치환 이름
          changeWord: changeWords, // 치환 문구
        },
      ],
      refKey: `ref_${Date.now()}`,          // 고유 참조 키
    };

    const response = await axios.post(`${process.env.REACT_APP_SERVER_IP}/ppurio/message/send-SMS`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response);
    console.log('Response Data:', response.data);
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
export const sendMMS = async (recipient, message, imgUrl, changeWords = {}) => {
  try {
    const requestBody = {
      content: message,          // 메시지 내용
      duplicateFlag: 'N',        // 중복 제거
      targetCount: 1,            // 수신자 수
      targets: [
        {
          to: recipient,         // 수신자 번호
          name: '고객',           // 기본 치환 이름
          changeWord: changeWords, // 치환 문구
        },
      ],
      refKey: `ref_${Date.now()}`,          // 고유 참조 키
      imgUrl: imgUrl,
    };

    const response = await axios.post(`${process.env.REACT_APP_SERVER_IP}/ppurio/message/send-MMS`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버 응답을 받았지만 상태 코드가 2xx가 아닌 경우
      console.error('Response Data:', error.response.data); // 서버에서 보낸 에러 메시지
      console.error('Status:', error.response.status); // HTTP 상태 코드
      console.error('Headers:', error.response.headers); // 응답 헤더
    } else if (error.request) {
      // 요청이 이루어졌지만 응답이 없을 경우
      console.error('Request:', error.request);
    } else {
      // 요청 설정 중 문제가 발생한 경우
      console.error('Error:', error.message);
    }
  }
};
