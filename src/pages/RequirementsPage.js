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
    CheckboxContainer,
} from '../style/RequirementsPageStyles';
import LoadingSpinner from '../components/LoadingSpinner';
import ModalOverlay from '../components/ModalOverlay';
import { generateImage } from '../services/imageService';
import { fetchSampleImages } from '../services/sampleImageService';
import { uploadUserImage } from '../services/userUploadService';
import { translatePrompt } from '../services/translationService';

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
    const [useNegativePrompt, setUseNegativePrompt] = useState(false); // 체크박스 상태 추가
    const userId = sessionStorage.getItem('userId') || '1'; // 사용자 ID

    const imageWidth = 120 + 10;
    const maxVisibleImages = 7;

    // 샘플 이미지 가져오기
    useEffect(() => {
        const loadSampleImages = async () => {
            setIsLoading(true);
            try {
                const images = await fetchSampleImages();
                setSampleImages(images);
            } catch (error) {
                alert('샘플 이미지를 가져오는 데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadSampleImages();
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

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const uploadedImageUrl = await uploadUserImage(file, userId);
            setSampleImages((prev) => [uploadedImageUrl, ...prev]);
            alert('이미지가 성공적으로 업로드되었습니다.');
        } catch (error) {
            alert('이미지 업로드에 실패했습니다.');
        }
    };

    const handleGenerateImage = async () => {
        if (!requirement || !selectedSample || !selectedKeywords.length) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        console.log("negativePrompt 상태:", useNegativePrompt); // 디버깅용 로그 추가

        setLoading(true);

        try {
            const userPrompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const translatedPrompt = await translatePrompt(userPrompt, userId);

            const result = await generateImage({
                prompt: translatedPrompt,
                initImage: selectedSample,
                negativePrompt: useNegativePrompt, // 상태 전달
            });
            console.log(result.time);

            setGeneratedImage(result.uploadedImageUrl);
            setImageHistory((prevHistory) => [result.uploadedImageUrl, ...prevHistory]);
            setGenerationTime(result.time);
            setActivePage('ImageEditingPage');
        } catch (error) {
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
                        <p>
                            이미지 생성 소요 시간: <strong>{elapsedTime}초</strong>
                        </p>
                    )}
                    <Textarea value={requirement} onChange={handleTextareaChange} placeholder="요구사항을 입력해주세요." />
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
                    <div>
                        <CheckboxContainer>
                            <input
                                type="checkbox"
                                checked={useNegativePrompt}
                                onChange={() => setUseNegativePrompt((prev) => !prev)}
                            />
                        <label>GPT에게 프롬프트 부탁하기</label>
                        </CheckboxContainer>
                    </div>
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
