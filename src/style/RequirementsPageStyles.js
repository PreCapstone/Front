// styles/RequirementsPageStyles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
`;

export const Textarea = styled.textarea`
    width: 100%;
    height: 80px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    resize: none;
`;

export const ByteCount = styled.div`
    text-align: right;
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
`;

export const SampleImageLabel = styled.div`
    font-size: 25px;
    font-weight: bold;
    margin: 20px 0;
    text-align: left; /* 텍스트를 좌측으로 배치 */
`;

export const SliderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%; /* 가로 크기 제한 */
`;

export const SampleImageList = styled.div`
    display: flex;
    gap: 10px;
    transition: transform 0.3s ease-in-out;
    transform: translateX(${({ offset }) => offset}px);
    width: calc(120px * 7 + 60px); /* 7개의 이미지와 갭에 맞는 너비 설정 */
`;

export const SampleImage = styled.img`
    width: 120px;
    height: 120px;
    border: 2px solid ${({ selected }) => (selected ? '#6a1bb3' : '#ccc')};
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
        border-color: #6a1bb3;
    }
`;

export const SliderButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    z-index: 10;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }

    ${({ direction }) => (direction === 'left' ? `left: 10px;` : `right: 10px;`)};
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const ActionButton = styled.button`
    padding: 10px 20px;
    background-color: ${({ primary }) => (primary ? '#6a1bb3' : '#ddd')};
    color: ${({ primary }) => (primary ? 'white' : 'black')};
    border: none;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: ${({ primary }) => (primary ? '#531299' : '#bbb')};
    }
`;
