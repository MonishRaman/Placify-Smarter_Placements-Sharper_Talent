import React from 'react'

export default function Ai_Interview() {
  const openStreamlitApp = () => {
    // Navigate to the Streamlit app
    window.open("http://localhost:8501", "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button 
  onClick={openStreamlitApp} 
  style={{
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px"
  }}
>
  Click Here To Take Interview From AI
</button>
    </div>
  );
}
