/**
 * 사용자 이미지를 S3에 업로드하고 URL을 반환받는 함수
 *
 * @param {Blob} file - 업로드할 이미지 파일 (Blob 형식)
 * @param {string} userId - 사용자 ID
 * @returns {Promise<string>} 업로드된 이미지의 S3 URL
 */
export const uploadImageToS3 = async (file, userId) => {
  const formData = new FormData();

  // FormData에 이미지 파일과 사용자 ID 추가
  formData.append("file", file);
  formData.append("id", userId);

  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/user/upload`, {
      method: "POST",
      body: formData,
    });

    // HTTP 응답 상태 코드 확인
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답을 텍스트로 받아 URL로 사용
    const textResponse = await response.text();

    // URL 유효성 검사
    if (!textResponse.startsWith("http")) {
      throw new Error("응답 데이터가 유효한 URL 형식이 아닙니다.");
    }

    return textResponse; // S3 URL 반환
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error.message);
    throw error; // 오류를 호출한 곳에서 처리할 수 있도록 던지기
  }
};
