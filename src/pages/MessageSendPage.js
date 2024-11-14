import React, { useState } from 'react';
import styled from 'styled-components';
import { sendSMS, sendMMS } from '../services/messageService'; // 서비스 임포트

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

const LeftPane = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const RightPane = styled.div`
  flex: 1;
  padding-left: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  resize: none;
  background-color: #f5f5f5;
  pointer-events: none; /* 수정 불가능 */
  color: #333;
`;

const NumberInputSection = styled.div`
  margin-bottom: 20px;
`;

const SubSectionTitle = styled.h3`
  margin-bottom: 10px;
`;

const NumberInputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
  }
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom: 10px;

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  padding: 10px;
  background-color: gray;
  color: white;
  border: none;
  cursor: pointer;
  width: 150px;
  position: absolute;
  bottom: 20px;
  left: 20px;
`;

const RecipientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 100px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const RecipientItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    font-weight: bold;
  }
`;

const MessageSendPage = ({ setActivePage, previousMessage }) => {
  const [message] = useState(previousMessage);
  const [title, setTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState({
    part1: '',
    part2: '',
    part3: '',
  });
  const [recipients, setRecipients] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const handlePhoneNumberChange = (e, part) => {
    setPhoneNumber({
      ...phoneNumber,
      [part]: e.target.value,
    });
  };

  const handleAddPhoneNumber = () => {
    const fullNumber = `${phoneNumber.part1}-${phoneNumber.part2}-${phoneNumber.part3}`;
    if (
      !recipients.includes(fullNumber) &&
      fullNumber.replace(/-/g, '').length === 11
    ) {
      setRecipients([...recipients, fullNumber]);
      setPhoneNumber({ part1: '', part2: '', part3: '' });
    }
  };

  const handleRemoveRecipient = (number) => {
    setRecipients(recipients.filter((recipient) => recipient !== number));
  };

  const handleSendMessage = async () => {
    setIsSending(true);
    try {
      const byteCount = new TextEncoder().encode(message).length;
      await Promise.all(
        recipients.map((recipient) =>
          byteCount > 80
            ? sendMMS(recipient, title, message)
            : sendSMS(recipient, title, message)
        )
      );
      alert('모든 메시지 전송 성공!');
    } catch (error) {
      alert('일부 메시지 전송 실패: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <LeftPane>
          <SectionTitle>메시지 전송</SectionTitle>
          <Input
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea value={message} readOnly />
        </LeftPane>
        <RightPane>
          <NumberInputSection>
            <SubSectionTitle>번호 입력</SubSectionTitle>
            <NumberInputGroup>
              <input
                type="text"
                maxLength="3"
                value={phoneNumber.part1}
                onChange={(e) => handlePhoneNumberChange(e, 'part1')}
              />
              <input
                type="text"
                maxLength="4"
                value={phoneNumber.part2}
                onChange={(e) => handlePhoneNumberChange(e, 'part2')}
              />
              <input
                type="text"
                maxLength="4"
                value={phoneNumber.part3}
                onChange={(e) => handlePhoneNumberChange(e, 'part3')}
              />
            </NumberInputGroup>
            <SubmitButton onClick={handleAddPhoneNumber}>번호 추가</SubmitButton>
          </NumberInputSection>
          <NumberInputSection>
            <SubSectionTitle>받는 사람</SubSectionTitle>
            <RecipientList>
              {recipients.map((recipient, index) => (
                <RecipientItem key={index}>
                  {recipient}
                  <RemoveButton
                    onClick={() => handleRemoveRecipient(recipient)}
                  >
                    X
                  </RemoveButton>
                </RecipientItem>
              ))}
            </RecipientList>
            <SubmitButton
              onClick={handleSendMessage}
              disabled={recipients.length === 0 || isSending}
            >
              {isSending ? '전송 중...' : '발송하기'}
            </SubmitButton>
          </NumberInputSection>
        </RightPane>
      </FormContainer>
      <BackButton onClick={() => setActivePage('MessageInput')}>
        뒤로가기
      </BackButton>
    </PageContainer>
  );
};

export default MessageSendPage;