import React from 'react';

function MessageInput({ message, setMessage }) {
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="message-input">
      <h3>메시지 입력</h3>
      <textarea
        value={message}
        onChange={handleInputChange}
        placeholder="메시지를 입력해주세요."
      />
      <div className="byte-count">{message.length}/2000byte</div>
      <button onClick={() => console.log('AI 자동 생성 클릭됨')}>AI 자동 생성</button>
    </div>
  );
}

export default MessageInput;
