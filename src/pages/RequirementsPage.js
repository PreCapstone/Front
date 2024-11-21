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
    UploadContainer,
    UploadLabel,
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
                              setGenerationTime,
                          }) => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [sampleImages, setSampleImages] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(null);
    const [userId] = useState(sessionStorage.getItem('userId') || '1'); // 사용자 ID
    const [uploadedImage, setUploadedImage] = useState(null);

    const imageWidth = 120 + 10;
    const maxVisibleImages = 7;

    // 샘플 이미지 가져오기
    useEffect(() => {
        const fetchSampleImages = async () => {
            const url = 'http://3.38.60.170:8080/get-sample'; // 서버 IP 사용
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

    const translatePrompt = async (prompt) => {
        try {
            const response = await fetch('http://3.38.60.170:8080/GPT/api/create-sd-prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userPrompt: prompt,
                    id: userId,
                }),
            });

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(`HTTP 오류 상태: ${response.status}, 응답: ${responseText}`);
            }

            if (responseText.startsWith('{')) {
                const data = JSON.parse(responseText);
                console.log('번역된 프롬프트:', data.translatedPrompt);
                return data.translatedPrompt;
            } else {
                console.log('번역된 프롬프트 (텍스트):', responseText.trim());
                return responseText.trim();
            }
        } catch (error) {
            console.error('프롬프트 변환 실패:', error);
            alert('프롬프트 변환에 실패했습니다. 서버 상태를 확인해주세요.');
            throw error;
        }
    };


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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', userId);

        try {
            const response = await fetch('http://3.38.60.170:8080/user/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP 오류 상태: ${response.status}`);
            }

            // 서버가 JSON 대신 문자열을 반환하는 경우
            const responseData = await response.text();
            console.log('Server Response:', responseData);

            // 서버 응답이 URL 문자열인 경우
            if (responseData.startsWith('http')) {
                setUploadedImage(responseData); // 업로드된 이미지의 URL 저장
                setSampleImages((prev) => [responseData, ...prev]); // 새 이미지 샘플 리스트에 추가
                alert('이미지가 성공적으로 업로드되었습니다.');
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
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

            // 요구사항 및 키워드를 포함한 최종 프롬프트 생성
            const userPrompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const englishPrompt = await translatePrompt(userPrompt); // 영어 번역 처리

            // 이미지 생성 요청
            const result = await generateImage({
                prompt: englishPrompt,
                initImage: selectedSample,
            });

            if (!result) {
                throw new Error('이미지 생성 결과가 비어 있습니다.');
            }

            const endTime = performance.now();
            const timeElapsed = ((endTime - startTime) / 1000).toFixed(2);
            setElapsedTime(timeElapsed);

            setGeneratedImage(result);
            setImageHistory((prevHistory) => [result, ...prevHistory]);
            setGenerationTime(result.time);
            setActivePage('ImageEditingPage');
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
                    <SampleImageLabel>샘플 이미지를 선택하거나 새로 업로드</SampleImageLabel>
                    <UploadContainer>
                        <UploadLabel htmlFor="file-upload">이미지 업로드</UploadLabel>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </UploadContainer>
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
