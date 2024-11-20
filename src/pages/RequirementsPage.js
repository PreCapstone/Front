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
import LoadingSpinner from '../components/LoadingSpinner';
import ModalOverlay from '../components/ModalOverlay';
import { generateImage } from '../services/imageService';

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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [sampleImages, setSampleImages] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(null); // 소요 시간 상태 추가

    const imageWidth = 120 + 10;
    const maxVisibleImages = 7;

    useEffect(() => {
        const fetchSampleImages = async () => {
            const url = 'http://3.38.60.170:8080/get-sample';
            setIsLoading(true);
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
                setIsLoading(false);
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
            const startTime = performance.now();

            const userPrompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const englishPrompt = await translatePrompt(userPrompt);
            const result = await generateImage({ prompt: englishPrompt, initImage: selectedSample });

            if (!result) {
                throw new Error('이미지 생성 결과가 비어 있습니다.');
            }

            const endTime = performance.now();
            const timeElapsed = ((endTime - startTime) / 1000).toFixed(2);
            setElapsedTime(timeElapsed);

            setGeneratedImage(result); // 생성된 이미지 저장
            setImageHistory((prevHistory) => [result, ...prevHistory]); // 히스토리 업데이트
            setActivePage('ImageEditingPage'); // 페이지 전환

            console.log('Image generated successfully:', result);
            console.log('Page switched to ImageEditingPage');
        } catch (error) {
            console.error('이미지 생성 실패:', error);
            alert('이미지 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <PageContainer>
            {isLoading ? (
                <ModalOverlay>
                    <LoadingSpinner text="샘플 이미지를 가져오는 중입니다..." />
                </ModalOverlay>
            ) : (
                <>
                    <h1>요구사항을 적어주세요</h1>
                    {elapsedTime && (
                        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                            이미지 생성 소요 시간: <strong>{elapsedTime}초</strong>
                        </p>
                    )}
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
