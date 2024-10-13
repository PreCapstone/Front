import React from 'react';

function ImageDisplay({ selectedImage }) {
  return (
    <div className="image-display">
      <h3>이미지</h3>
      {selectedImage ? (
        <img src={selectedImage} alt="선택된 이미지" />
      ) : (
        <div className="placeholder">이미지를 선택하세요.</div>
      )}
    </div>
  );
}

export default ImageDisplay;
