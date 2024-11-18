import axios from 'axios';

/**
 * SMS 전송 API 호출
 * @param {string} recipient - 수신자 번호
 * @param {string} message - 전송할 메시지
 * @returns {Promise} - API 응답
 */
export const sendSMS = async (recipient, message) => {
  try {
    const requestBody = {
      content: message,          // 메시지 내용
      duplicateFlag: 'N',        // 중복 제거
      targetCount: 1,            // 수신자 수
      targets: [
        {
          to: recipient,         // 수신자 번호
          name: '고객',           // 기본 치환 이름
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
export const sendMMS = async (recipient, message, fileName = null, fileData = null) => {
  try {
    const requestBody = {
      content: message,          // 메시지 내용
      duplicateFlag: 'N',        // 중복 제거
      targetCount: 1,            // 수신자 수
      targets: [
        {
          to: recipient,         // 수신자 번호
          name: '고객',           // 기본 치환 이름
        },
      ],
      refKey: `ref_${Date.now()}`,          // 고유 참조 키
    };

    // 파일 정보가 있는 경우에만 files 필드 추가
    if (fileName && fileData) {
      requestBody.files = [
        {
          name: fileName,        // 파일 이름
          data: fileData,        // Base64 인코딩된 파일 데이터
          size: Buffer.from(fileData, 'base64').length, // 파일 크기 (바이트 단위)
        },
      ];
    }

    const response = await axios.post(`${process.env.REACT_APP_SERVER_IP}/ppurio/message/send-MMS`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('MMS 전송 실패:', error);
    throw error;
  }
};
