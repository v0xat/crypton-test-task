import React from 'react';

const Loading = () => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 3,
          top: "50%",
          left: "50%",
          width: "100px",
          height: "50px",
          textAlign: "center",
        }}
      >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;