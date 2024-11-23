import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { sendMMS } from '../services/messageService'; // MMS 전송 함수 임포트

const PageContainer = styled.div`
  display: flex;
  flex-direction: row; /* 수평 배치 */
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const LeftPane = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  margin-right: 20px;
`;

const RightPane = styled.div`
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
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
  color: #333;
  overflow-y: auto;
`;

const ImageUploadContainer = styled.div`
  margin-top: 10px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #888;
  border-radius: 5px;
  margin-top: 10px;
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
    box-sizing: border-box;
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
  right: 20px;
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

const ImageSendPage = ({ setActivePage, previousMessage, generatedImage, editedImage }) => {
  const [message] = useState(previousMessage);
  const [phoneNumber, setPhoneNumber] = useState({
    part1: '',
    part2: '',
    part3: '',
  });
  const [recipients, setRecipients] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("editedImage:", editedImage);
    console.log("generatedImage:", generatedImage);
    
    if (editedImage) {
      setSelectedImage({ imgUrl: editedImage });
    } else if (generatedImage) {
      setSelectedImage({ imgUrl: generatedImage });
    }
  }, [editedImage, generatedImage]);  

  useEffect(() => {
    if (selectedImage) {
      setImagePreview(selectedImage);
    }
  }, [selectedImage]);

  const handlePhoneNumberChange = (e, part) => {
    setPhoneNumber({
      ...phoneNumber,
      [part]: e.target.value,
    });
  };

  const handleAddPhoneNumber = () => {
    const fullNumber = `${phoneNumber.part1}${phoneNumber.part2}${phoneNumber.part3}`;
    if (fullNumber.length !== 11 || isNaN(fullNumber)) {
      alert('올바른 전화번호를 입력하세요.');
      return;
    }

    if (!recipients.includes(fullNumber)) {
      setRecipients([...recipients, fullNumber]);
      setPhoneNumber({ part1: '', part2: '', part3: '' });
    } else {
      alert('이미 추가된 번호입니다.');
    }
  };

  const handleRemoveRecipient = (number) => {
    setRecipients(recipients.filter((recipient) => recipient !== number));
  };

  const handleSendMessage = async () => {
    if (!selectedImage || !selectedImage.imgUrl) {
      alert('이미지를 선택하거나 올바른 이미지 URL을 확인하세요.');
      return;
    }
  
    const imgUrl = selectedImage.imgUrl;
  
    try {
      // 모든 수신자에게 메시지 전송
      const responses = await Promise.all(
        recipients.map((recipient) =>
          sendMMS(recipient, message, imgUrl, {}) // changeWords는 필요 시 빈 객체로 전달
        )
      );
  
      // 성공 여부 확인
      responses.forEach((response, index) => {
        if (response?.code === '1000') {
          console.log(`메시지 전송 성공: ${recipients[index]}`);
        } else {
          console.error(`메시지 전송 실패(${recipients[index]}):`, response);
        }
      });
  
      alert('모든 메시지가 성공적으로 전송되었습니다!');
    } catch (error) {
      console.error('전송 실패:', error);
      alert(`전송 실패: ${error.response?.data || error.message}`);
    }
  };  
  
  return (
    <PageContainer>
      <LeftPane>
        <SectionTitle>메시지 전송</SectionTitle>
        <Textarea value={message} readOnly />
        <SectionTitle>이미지</SectionTitle>
        <ImageUploadContainer>
          {imagePreview ? (
            <ImagePlaceholder>
              <img src={imagePreview.imgUrl || imagePreview} alt="이미지 미리보기" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </ImagePlaceholder>
          ) : (
            <ImagePlaceholder>이미지가 없습니다.</ImagePlaceholder>
          )}
        </ImageUploadContainer>
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
                <RemoveButton onClick={() => handleRemoveRecipient(recipient)}>
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

      <BackButton onClick={() => setActivePage('ImageEditingPage')}>뒤로가기</BackButton>
    </PageContainer>
  );
};

export default ImageSendPage;
