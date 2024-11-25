import axios from 'axios';

/**
 * 회원가입 API 호출
 * @param {Object} userData - 회원가입 데이터 (id, password)
 * @param {string} userData.id - 사용자 아이디
 * @param {string} userData.password - 사용자 비밀번호
 * @returns {Promise} - 서버 응답
 */
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_IP}/signup/`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // 서버에서 반환된 데이터를 호출하는 컴포넌트로 전달
  } catch (error) {
    if (error.response) {
      // 서버에서 반환된 에러
      throw new Error(error.response.data || '서버 오류가 발생했습니다.');
    } else {
      // 네트워크 에러 또는 서버 응답 없음
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    }
  }
};

/**
 * **[추가된 부분]**
 * 로그인 API 호출
 * @param {Object} loginData - 로그인 데이터 (id, password)
 * @param {string} loginData.id - 사용자 아이디
 * @param {string} loginData.password - 사용자 비밀번호
 * @returns {Promise} - 서버 응답
 */
export const login = async (loginData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_IP}/signup/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // sessionStorage에 토큰 저장
    sessionStorage.setItem('authToken', response.data.token);

    // 유저 id 저장 - 다른 api 부를 때 줘야 되니까. const userId = sessionStorage.getItem('userId');로 이후 사용
    sessionStorage.setItem('userId', response.data);

    return response.data; // 로그인 성공 시 데이터 반환

  } catch (error) {
    if (error.response) {
      // 서버에서 반환된 에러
      throw new Error(error.response.data || '로그인 실패. 아이디와 비밀번호를 확인해주세요.');
    } else {
      // 네트워크 에러 또는 서버 응답 없음
      throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    }
  }
};

/**
 * 로그아웃 함수
 */
export const logout = () => {
  sessionStorage.removeItem('authToken'); // 세션에서 토큰 제거
  //오류해결
  sessionStorage.removeItem('userId');
  window.location.reload();
};
