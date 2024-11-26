import React, { useState, useRef, useEffect } from 'react';

function ResizableImage() {
  const [imageSize, setImageSize] = useState({ width: 300, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsResizing(true);
    setResizeStart({ x: event.clientX, y: event.clientY });
    setStartSize({ width: imageSize.width, height: imageSize.height });
  };

  const handleMouseMove = (event) => {
    if (!isResizing) return;

    const deltaX = event.clientX - resizeStart.x;
    const deltaY = event.clientY - resizeStart.y;

    setImageSize({
      width: Math.max(50, startSize.width + deltaX),
      height: Math.max(50, startSize.height + deltaY),
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      // 마우스 이동 및 업 이벤트 리스너 추가
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      // 이벤트 리스너 제거
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleStyle = {
    width: '15px',
    height: '15px',
    background: 'blue',
    position: 'absolute',
    right: '0',
    bottom: '0',
    cursor: 'nwse-resize',
  };

  const containerStyle = {
    position: 'relative',
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`,
    border: '1px solid #ccc',
    display: 'inline-block',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover',
  };

  return (
    <div style={containerStyle}>
      <img
        src="https://hs-m2m-bucket.s3.ap-northeast-2.amazonaws.com/0_20241114214128.png"
        alt="Resizable"
        style={imageStyle}
      />
      <div style={handleStyle} onMouseDown={handleMouseDown}></div>
    </div>
  );
}

export default ResizableImage;
