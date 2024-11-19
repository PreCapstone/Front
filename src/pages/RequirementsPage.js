import React, { useState } from 'react';
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
} from '../style/RequirementsPageStyles'; // 스타일 불러오기
import { generateImage } from '../services/imageService'; // 이미지 생성 서비스 가져오기

const RequirementsPage = ({
                              setActivePage,
                              requirement,
                              setRequirement,
                              setGeneratedImage,
                              setImageHistory,
                              selectedKeywords,
                          }) => {
    const [loading, setLoading] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null);
    const [currentOffset, setCurrentOffset] = useState(0);

    const sampleImages = [
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/0_20241114214128.png',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/8123098.png',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/2023051202050_0.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/8daf7186d8295947ed8bc84873c9671c.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/%EC%BA%A1%EC%B2%98.PNG_4_20241117_070055.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/913_736_2524.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/unnamed.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/unnamed+(1).jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/t-35.jpg',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/lovepik-learning-notebooks-material-image-png-image_400487469_wh1200.png',
        'https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/kheanh_202402200441.jpg',
    ];

    const maxVisibleImages = 7; // 한번에 보여줄 이미지 개수
    const imageWidth = 120 + 10; // 이미지 가로 크기 + gap
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

    const handleGenerateImage = async () => {
        if (!requirement && !selectedSample) {
            alert('요구사항을 작성하고, 샘플 이미지를 선택해주세요.');
            return;
        }

        if (!requirement) {
            alert('요구사항을 입력해주세요.');
            return;
        }

        if (!selectedSample) {
            alert('샘플 이미지를 선택해주세요.');
            return;
        }

        setLoading(true);

        try {
            //const prompt = `${previousMessage} 키워드: ${selectedKeywords.join(', ')}. ${requirement}`;
            const prompt = `${requirement}`;
            const result = await generateImage({ prompt, initImage: selectedSample });

            console.log("Generated Image URL in RequirementPage:", result);
            setGeneratedImage(result);
            setImageHistory((prevHistory) => [result, ...prevHistory]); // 히스토리 업데이트
            setActivePage('ImageEditingPage'); // 이미지 생성 후 편집 페이지로 이동
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
        </PageContainer>
    );
};

export default RequirementsPage;
