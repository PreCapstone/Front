import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Button from '../components/Button.js';
import { extractKeywords } from '../services/keywordService';
import ModalOverlay from '../components/ModalOverlay';
import LoadingSpinner from '../components/LoadingSpinner';
import { PRIMARY_COLOR } from '../style/colors';
import {
  PageContainer,
  InputContainer,
  InputField,
  KeywordContainer,
  KeywordItem,
  ButtonContainer,
  PageTitle,
  DeleteZone
} from '../style/KeywordSelectionPageStyles';

const KeywordSelectionPage = ({ message, setActivePage, setKeywords }) => {
  const [keywords, setKeywordsLocal] = useState([]);
  const [inputKeyword, setInputKeyword] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKeywords = async () => {
      console.log('현재 message:', message);

      if (!message) {
        console.log('message가 비어있습니다');
        return;
      }

      setIsLoading(true);
      try {
        console.log('API 호출 시작');
        const extractedKeywords = await extractKeywords(message);
        console.log('API 응답:', extractedKeywords);
        setKeywordsLocal(extractedKeywords); // 로컬 상태 업데이트
      } catch (error) {
        console.error('키워드 추출 실패:', error);
        alert('키워드 추출에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, [message]);

  const handleAddKeyword = () => {
    if (inputKeyword.trim() && !keywords.includes(inputKeyword)) {
      const newKeywords = [...keywords, inputKeyword.trim()];
      setKeywordsLocal(newKeywords); // 로컬 상태 업데이트
      setInputKeyword('');
      console.log('키워드 추가됨. 현재 키워드:', newKeywords);
    }
  };

  const handleRemoveKeyword = (keyword) => {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywordsLocal(newKeywords); // 로컬 상태 업데이트
    console.log('키워드 삭제됨. 현재 키워드:', newKeywords);
  };

  const handleDragEnd = (event, info, keyword) => {
    const deleteZone = document.querySelector(".delete-zone");
    if (!deleteZone) return;

    const deleteZoneRect = deleteZone.getBoundingClientRect();
    const point = { x: event.clientX, y: event.clientY };

    if (
        point.x >= deleteZoneRect.left &&
        point.x <= deleteZoneRect.right &&
        point.y >= deleteZoneRect.top &&
        point.y <= deleteZoneRect.bottom
    ) {
      handleRemoveKeyword(keyword);
    }
    setIsDraggingOver(false);
  };

  // 부모 상태 업데이트 및 다음 페이지로 이동
  const handleNextPage = () => {
    setKeywords(keywords); // 부모 상태 업데이트
    console.log("최종 선택된 키워드:", keywords);
    setActivePage('Requirements'); // 다음 페이지 이동
  };

  return (
      <PageContainer>
        {isLoading ? (
            <ModalOverlay>
              <LoadingSpinner text="키워드를 추출하고 있습니다..." />
            </ModalOverlay>
        ) : (
            <>
              <PageTitle>키워드 선택</PageTitle>
              <InputContainer>
                <InputField
                    placeholder="키워드를 입력하세요"
                    value={inputKeyword}
                    onChange={(e) => setInputKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button
                    text="+"
                    onClick={handleAddKeyword}
                    backgroundColor={PRIMARY_COLOR}
                />
              </InputContainer>

              <KeywordContainer>
                <AnimatePresence>
                  {keywords.map((keyword, index) => (
                      <motion.div
                          key={keyword}
                          initial={{ y: -50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                          }}
                          drag
                          dragSnapToOrigin
                          onDragEnd={(event, info) => handleDragEnd(event, info, keyword)}
                          whileHover={{ scale: 1.05 }}
                          whileDrag={{ scale: 1.1, zIndex: 2 }}
                          style={{ position: 'relative' }}
                      >
                        <KeywordItem>
                          #{keyword}
                        </KeywordItem>
                      </motion.div>
                  ))}
                </AnimatePresence>
              </KeywordContainer>

              <DeleteZone
                  className="delete-zone"
                  $isDraggingOver={isDraggingOver}
                  onDragEnter={() => setIsDraggingOver(true)}
                  onDragLeave={() => setIsDraggingOver(false)}
              >
                여기에 드롭하여 삭제
              </DeleteZone>

              <ButtonContainer>
                <Button
                    text="← 이전"
                    onClick={() => setActivePage('MessageInput')}
                    backgroundColor="#ddd"
                    textColor="#333"
                />
                <Button
                    text="선택 완료 →"
                    onClick={handleNextPage} // 기존 로직 유지
                    backgroundColor={PRIMARY_COLOR}
                />
              </ButtonContainer>
            </>
        )}
      </PageContainer>
  );
};

export default KeywordSelectionPage;
