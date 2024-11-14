import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { generateGPTMessage } from '../services/gptService';

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;

  &:hover {
    color: black;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: #6a1bb3;
  color: white;
  border: none;
  cursor: pointer;
`;

const MessageRequestModal = ({ onClose, onGenerate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const generatedMessage = await generateGPTMessage(input);
      onGenerate(generatedMessage);
    } catch (error) {
      alert('메시지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <ModalContainer>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
      <h2>요청사항 입력</h2>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="요청사항을 입력하세요..."
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? '생성 중...' : '메시지 자동 생성'}
      </Button>
    </ModalContainer>
  );
};

export default MessageRequestModal;
