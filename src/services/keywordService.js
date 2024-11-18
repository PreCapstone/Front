export const extractKeywords = async (message) => {
    console.log('API 요청 데이터:', { message });
    
    try {
      const url = `${process.env.REACT_APP_SERVER_IP}/GPT/api/extract-keyword`;
      console.log('요청 URL:', url);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      console.log('API 응답 상태:', response.status);
  
      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API 응답 데이터:', data);
      return data;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      throw error;
    }
  };