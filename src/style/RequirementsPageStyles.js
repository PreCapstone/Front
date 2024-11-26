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
    height: 200px; /* 세로 공간 증가 */
`;

export const SampleImageList = styled.div`
    display: flex;
    gap: 10px;
    transition: transform 0.3s ease-in-out;
    transform: translateX(${({ offset }) => offset}px);
    width: calc(120px * 7 + 60px); /* 7개의 이미지와 갭에 맞는 너비 설정 */
    position: relative; /* 확대된 이미지 표시를 위한 설정 */
`;

export const SampleImage = styled.img`
    width: 120px;
    height: 120px;
    border: 4px solid ${({selected}) => (selected ? '#e20e0e' : '#ccc')}; /* 선택된 경우 두께를 4px로 설정 */
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;

    &:hover {
        border-color: #e20e0e;
        transform: scale(1.5); /* 이미지 확대 */
        z-index: 5; /* 다른 이미지 위로 올라옴 */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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
    margin-top: 25px; /* 간격 추가 */
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

export const UploadContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 15px 0;
    gap: 10px;
`;

export const UploadLabel = styled.label`
    padding: 10px 15px;
    background-color: #0066ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;

    &:hover {
        background-color: #004bb5;
    }
`;

export const CheckboxContainer = styled.div`
    margin-top: 20px; /* 샘플 이미지와 체크박스 사이에 간격 추가 */
    display: flex;
    align-items: center;
    gap: 10px; /* 체크박스와 텍스트 사이 간격 */
`;

