const ActiveCallDetail = ({ assistantIsSpeaking, volumeLevel }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "20px",
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