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
                              setGenerationAPITime,
                          }) => {
    const [loading, setLoading] = useState(false); // 하나로 통합
    const [selectedSample, setSelectedSample] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);
    const [sampleImages, setSampleImages] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(null);
    const [useNegativePrompt, setUseNegativePrompt] = useState(false); // 체크박스 상태 추가
    const userId = sessionStorage.getItem('userId') || '1'; // 사용자 ID

    const imageWidth = 120 + 10;
    const maxVisibleImages = 7;
    const [sliderHeight, setSliderHeight] = useState(200); // 초기 높이 설정

    // 샘플 이미지 가져오기
    useEffect(() => {
        const loadSampleImages = async () => {
            setLoading(true); // 로딩 상태 설정
            try {
                const images = await fetchSampleImages();
                setSampleImages(images);
            } catch (error) {
                alert('샘플 이미지를 가져오는 데 실패했습니다.');
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        loadSampleImages();
    }, []);

    const maxOffset = -(Math.ceil(sampleImages.length / maxVisibleImages) - 1) * (imageWidth * maxVisibleImages);

    const handleImageHover = (isHovered) => {
        setSliderHeight(isHovered ? 300 : 200); // 확대 여부에 따라 높이 조정
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

        const startTime = Date.now();

        try {
            const userPrompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const translatedPrompt = await translatePrompt(userPrompt, userId);

            const result = await generateImage({
                prompt: translatedPrompt,
                initImage: selectedSample,
                negativePrompt: useNegativePrompt, // 상태 전달
            });

            setGeneratedImage(result.uploadedImageUrl);
            setImageHistory((prevHistory) => [result.uploadedImageUrl, ...prevHistory]);

            const endTime = Date.now();
            setGenerationTime((endTime - startTime) / 1000);
            setGenerationAPITime(result.time);
            console.log(result.time);

            setActivePage('ImageEditingPage');
        } catch (error) {
            alert('이미지 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            {loading ? (
                <ModalOverlay>
                    <LoadingSpinner text="이미지를 생성 하고있습니다..." />
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
                                    onMouseEnter={() => handleImageHover(true)} // 마우스 올릴 때
                                    onMouseLeave={() => handleImageHover(false)} // 마우스 뗄 때
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
