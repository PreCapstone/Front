// src/pages/TemplatePage.js
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const TemplateList = styled.div`
  width: 25%;
  padding: 10px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
`;

const TemplateItem = styled.div`
  width: 100%;
  height: 100px;
  background-color: #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
`;

const PreviewContainer = styled.div`
  width: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const ResultContainer = styled.div`
  width: 25%;
  padding: 10px;
  border-left: 1px solid #ddd;
`;

const ResultImage = styled.div`
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 10px;
`;

const CompleteButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background-color: #9B30FF;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #6a1bb3;
  }
`;

const TemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    { id: 1, title: "Template 1", imageUrl: "https://via.placeholder.com/300" },
    { id: 2, title: "Template 2", imageUrl: "https://via.placeholder.com/300" },
    { id: 3, title: "Template 3", imageUrl: "https://via.placeholder.com/300" },
  ];

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <Container>
      <TemplateList>
        <h2>추천 템플릿</h2>
        <input type="text" placeholder="카테고리 선택 혹은 검색" style={{ width: '100%', marginBottom: '10px' }} />
        {templates.map((template) => (
          <TemplateItem key={template.id} onClick={() => handleTemplateClick(template)}>
            {template.title}
          </TemplateItem>
        ))}
      </TemplateList>

      <PreviewContainer>
        {selectedTemplate ? (
          <img
            src={selectedTemplate.imageUrl}
            alt={selectedTemplate.title}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        ) : (
          <p>템플릿을 선택하세요</p>
        )}
      </PreviewContainer>

      <ResultContainer>
        <h2>생성 결과</h2>
        {selectedTemplate && (
          <ResultImage>
            <img
              src={selectedTemplate.imageUrl}
              alt={selectedTemplate.title}
              style={{ width: '100%' }}
            />
          </ResultImage>
        )}
        <CompleteButton>제작완료</CompleteButton>
      </ResultContainer>
    </Container>
  );
};

export default TemplatePage;
