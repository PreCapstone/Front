import styled from 'styled-components';
import { PRIMARY_COLOR } from './colors';

 // clamp(최소값, 선호값, 최대값) 

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 90vh;
  padding: 2rem;
  width: 90%;
  margin: 0 auto;
  gap: 2vh;
  position: relative;
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
    border-color: ${PRIMARY_COLOR};
  }
`;

export const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 50vh;
  overflow: visible;
  padding: 1rem;
  border: 0.15rem solid ${PRIMARY_COLOR};
  border-radius: 0.4rem;
  min-height: 15vh;
  background-color: #f8f8f8;
  position: relative;
`;

export const KeywordItem = styled.div`
  background-color: #e0e0e0;
  padding: 0.8rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: move;
  user-select: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  white-space: nowrap;
`;

export const DeleteZone = styled.div`
  height: 10vh;
  border: 0.15rem dashed ${props => props.$isDraggingOver ? '#ff0000' : '#ff6b6b'};
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDraggingOver ? '#ff0000' : '#ff6b6b'};
  margin-top: 1rem;
  background-color: ${props => props.$isDraggingOver ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
  transition: all 0.3s ease;
`;

export const ButtonContainer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

export const PageTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1vh;
  color: #333;
`;