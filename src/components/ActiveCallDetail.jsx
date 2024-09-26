const ActiveCallDetail = ({ assistantIsSpeaking, volumeLevel, connected }) => {
  return (
    <div style={{
      display: connected ? "flex" : "none",  // Show only when connected
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",  // Center align vertically
      marginTop: "10px",
      height: "60px",  // Set a fixed height
      visibility: connected ? "visible" : "hidden",  // Toggle visibility
    }}>
      <div style={{
        fontSize: "12px",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
        marginBottom: "10px",
      }}>
        {assistantIsSpeaking ? "Assistant is speaking" : "Assistant is listening"}
      </div>
      <div style={{
        width: "100px",
        height: "8px",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${volumeLevel * 100}%`,
          height: "100%",
          backgroundColor: "#4CAF50",
          transition: "width 0.1s ease-in-out",
        }}></div>
      </div>
    </div>
  );
};

export default ActiveCallDetail;
