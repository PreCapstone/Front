import React, { useState, useEffect } from 'react';
import {
    PageContainer,
    Textarea,
    SampleImageLabel,
    SliderContainer,
    SampleImageList,
    SampleImage,
    SliderButton,
    ButtonContainer,
    ActionButton,
} from '../style/RequirementsPageStyles';
import LoadingSpinner from '../components/LoadingSpinner'; // 로딩 스피너 추가
import ModalOverlay from '../components/ModalOverlay'; // 모달 오버레이 추가
import { generateImage } from '../services/imageService'; // 이미지 생성 서비스 가져오기

const RequirementsPage = ({
                              setActivePage,
                              requirement,
                              setRequirement,
                              setGeneratedImage,
                              setImageHistory,
                              selectedKeywords,
                              previousMessage,
                          }) => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 샘플 이미지 로딩 상태
    const [selectedSample, setSelectedSample] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [sampleImages, setSampleImages] = useState([]);

    const imageWidth = 120 + 10; // 이미지 가로 크기 + gap
    const maxVisibleImages = 7; // 한번에 보여줄 이미지 개수

    // Sample Images 가져오기
    useEffect(() => {
        const fetchSampleImages = async () => {
            const url = 'http://3.38.60.170:8080/get-sample'; // 실제 서버 URL 사용
            setIsLoading(true); // 로딩 시작
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류 상태: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setSampleImages(data);
                } else if (data && Array.isArray(data.sampleImages)) {
                    setSampleImages(data.sampleImages);
                } else {
                    console.error('응답 형식 오류: sampleImages가 배열이 아님');
                    alert('서버 응답 형식이 올바르지 않습니다.');
                }
            } catch (error) {
                console.error('Sample Images 가져오기 실패:', error);
                alert('샘플 이미지를 가져오는 데 실패했습니다.');
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchSampleImages();
    }, []);

    const maxOffset = -(Math.ceil(sampleImages.length / maxVisibleImages) - 1) * (imageWidth * maxVisibleImages);

    const handleTextareaChange = (e) => {
        setRequirement(e.target.value);
    };

    const handleImageClick = (image) => {
        setSelectedSample(image);
    };

    const handleSlider = (direction) => {
        if (direction === 'left' && currentOffset < 0) {
            setCurrentOffset((prev) => prev + imageWidth * maxVisibleImages);
        } else if (direction === 'right' && currentOffset > maxOffset) {
            setCurrentOffset((prev) => prev - imageWidth * maxVisibleImages);
        }
    };

    const translatePrompt = async (prompt) => {
        const id = sessionStorage.getItem('userId') || '1';

        try {
            const response = await fetch('http://3.38.60.170:8080/GPT/api/create-sd-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userPrompt: prompt,
                    id: id,
                }),
            });

            const responseText = await response.text();
            console.log('GPT API 응답 (텍스트):', responseText);

            if (!response.ok) {
                throw new Error(`HTTP 오류 상태: ${response.status}, 응답: ${responseText}`);
            }

            if (responseText.startsWith('{')) {
                const data = JSON.parse(responseText);
                return data.translatedPrompt;
            } else {
                return responseText.trim();
            }
        } catch (error) {
            console.error('GPT API 호출 실패:', error);
            alert('프롬프트 변환에 실패했습니다. 서버 상태를 확인해주세요.');
            throw error;
        }
    };


    const handleGenerateImage = async () => {
        if (!requirement) {
            alert('요구사항을 입력해주세요.');
            return;
        }

        if (!selectedSample) {
            alert('샘플 이미지를 선택해주세요.');
            return;
        }

        if (!selectedKeywords.length) {
            alert('키워드를 선택해주세요.');
            return;
        }

        setLoading(true);

        try {
            const userPrompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const englishPrompt = await translatePrompt(userPrompt);
            const result = await generateImage({ prompt: englishPrompt, initImage: selectedSample });

            setGeneratedImage(result);
            setImageHistory((prevHistory) => [result, ...prevHistory]);
            setActivePage('ImageEditingPage');
            alert('이미지가 성공적으로 생성되었습니다!');
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            alert('이미지 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            {isLoading && (
                <ModalOverlay>
                    <LoadingSpinner text="샘플 이미지를 가져오는 중입니다..." />
                </ModalOverlay>
            )}
            {!isLoading && (
                <>
                    <h1>요구사항을 적어주세요</h1>
                    <Textarea
                        value={requirement}
                        onChange={handleTextareaChange}
                        placeholder="요구사항을 입력해주세요."
                    />
                    <SampleImageLabel>샘플 이미지를 선택</SampleImageLabel>
                    <SliderContainer>
                        <SliderButton direction="left" onClick={() => handleSlider('left')}>
                            ‹
                        </SliderButton>
                        <SampleImageList offset={currentOffset}>
                            {sampleImages.map((img, index) => (
                                <SampleImage
                                    key={index}
                                    src={img}
                                    alt={`샘플 ${index}`}
                                    onClick={() => handleImageClick(img)}
                                    selected={selectedSample === img}
                                />
                            ))}
                        </SampleImageList>
                        <SliderButton direction="right" onClick={() => handleSlider('right')}>
                            ›
                        </SliderButton>
                    </SliderContainer>
                    <ButtonContainer>
                        <ActionButton onClick={() => setActivePage('KeywordSelection')}>← 이전</ActionButton>
                        <ActionButton primary onClick={handleGenerateImage} disabled={loading}>
                            {loading ? '생성 중...' : '이미지 생성'}
                        </ActionButton>
                    </ButtonContainer>
                </>
            )}
        </PageContainer>
    );
};

export default RequirementsPage;
