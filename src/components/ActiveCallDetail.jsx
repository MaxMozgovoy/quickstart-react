import AssistantSpeechIndicator from "./call/AssistantSpeechIndicator";
import Button from "./base/Button";
import VolumeLevel from "./call/VolumeLevel";

const ActiveCallDetail = ({ assistantIsSpeaking, volumeLevel, onEndCallClick }) => {
  return (
    <div>
      {/*
    <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
          width: "0px",
          height: "0px",
        }}
      >
       {/*<AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
      <VolumeLevel volume={volumeLevel} />*/}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button label="End Call" onClick={onEndCallClick} />
      </div>
      </div>

  );
};

export default ActiveCallDetail;
