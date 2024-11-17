// styles/KeywordSelectionPageStyles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  padding: 2rem;
  max-width: 90vw;
  margin: 0 auto;
  gap: 2rem;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

export const InputField = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #6a1bb3;
  }
`;

export const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 50vh;
  overflow-y: auto;
  padding: 1rem;
`;

export const KeywordItem = styled.div`
  background-color: #e0e0e0;
  padding: 0.8rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
`;

export const ButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const PageTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;