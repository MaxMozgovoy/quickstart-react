import AssistantSpeechIndicator from "./call/AssistantSpeechIndicator";
import Button from "./base/Button";
import VolumeLevel from "./call/VolumeLevel";

const ActiveCallDetail = ({ assistantIsSpeaking, volumeLevel, onEndCallClick, imgUrl }) => {
  return (
    <div>
      {/* Optional: add additional content here, such as indicators for speech or volume */}
      {/* 
      <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
      <VolumeLevel volume={volumeLevel} />
      */}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button 
          label="End Call" 
          onClick={onEndCallClick} 
          imgUrl={imgUrl} // Pass the imgUrl to Button component
        />
      </div>
    </div>
  );
};

export default ActiveCallDetail;

