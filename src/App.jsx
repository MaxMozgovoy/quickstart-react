// --- START OF FILE App.js ---
import { useEffect, useState, useCallback } from "react";
import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import Vapi from "@vapi-ai/web";
import { isPublicKeyMissingError } from "./utils";
import LottiePlayer from "./components/base/LottiePlayer";
import VideoBackground from "./components/VideoBackground"; // Import the new component

// Put your Vapi Public Key below.
const vapi = new Vapi("cff4fb76-054f-401d-bd84-07684185ea36");

const App = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [context, setContext] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [animationUrl, setAnimationUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // New state for video URL
  const [buttonUrl, setButtonUrl] = useState(""); // New state for button image URL
  const [bkColor, setBkColor] = useState("#000"); // New state for background color
  const [tapText, setTapText] = useState("Tap to talk:"); // New state for tap text
  const [tapTextColor, setTapTextColor] = useState("white"); // New state for tap text color
  const [mainText, setMainText] = useState(""); // New state for main text
  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } = usePublicKeyInvalid();

  const sendPhaseIdPrompt = useCallback(() => {
    if (phaseId) {
      console.log(`Sending phase ID prompt: ${phaseId}`);
      try {
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `Current Conversation Phase is: ${phaseId}. Use this conversation phase ${phaseId} to ask the right questions.`,
          },
        });
        console.log('Phase ID prompt sent successfully');
      } catch (error) {
        console.error('Error sending phase ID prompt:', error);
      }
    } else {
      console.warn('Phase ID is not set, skipping prompt');
    }
  }, [phaseId]);

  const sendContext = useCallback(() => {
    if (context) {
      console.log(`Sending context: ${context}`);
      try {
        vapi.send({
          type: 'add-message',
          message: {
            role: 'system',
            content: `Current user context is: ${context}. Refer to this user context ${context} in your questions.`,
          },
        });
        console.log('Context sent successfully');
      } catch (error) {
        console.error('Error sending context prompt:', error);
      }
    } else {
      console.warn('Context is not set, skipping prompt');
    }
  }, [context]);


  useEffect(() => {
    // Parse URL parameters (same as before)
    const urlParams = new URLSearchParams(window.location.search);
    // ... (parsing logic for all URL parameters including video)
    const idFromUrl = urlParams.get('id');
    const nameFromUrl = urlParams.get('name');
    const projectFromUrl = urlParams.get('project');
    const assistantFromUrl = urlParams.get('assistant_id');
    const phaseFromUrl = urlParams.get('phase_id');
    const contextFromUrl = urlParams.get('context');
    const imgFromUrl = urlParams.get('img_url');
    const animationFromUrl = urlParams.get('animation_url');
    const videoFromUrl = urlParams.get('video'); // Get video URL
    const buttonFromUrl = urlParams.get('button_url'); // Get button image URL
    const bkColorFromUrl = urlParams.get('bk_color'); // Get background color
    const tapTextFromUrl = urlParams.get('tap_text'); // Get tap text
    const tapTextColorFromUrl = urlParams.get('tap_text_color'); // Get tap text color
    const mainTextFromUrl = urlParams.get('main_text'); // Get main text


    if (idFromUrl) setUserId(idFromUrl);
    if (nameFromUrl) setUserName(decodeURIComponent(nameFromUrl));
    if (projectFromUrl) setProjectId(decodeURIComponent(projectFromUrl));
    if (animationFromUrl) setAnimationUrl(decodeURIComponent(animationFromUrl));
    if (assistantFromUrl) setAssistantId(assistantFromUrl);
    if (contextFromUrl) {
      setContext(contextFromUrl);
      console.log(`Context set from URL: ${contextFromUrl}`);
    }
    if (phaseFromUrl) {
      setPhaseId(phaseFromUrl);
      console.log(`Phase ID set from URL: ${phaseFromUrl}`);
    }
    if (imgFromUrl) setImgUrl(decodeURIComponent(imgFromUrl));
    if (videoFromUrl) setVideoUrl(decodeURIComponent(videoFromUrl)); // Set video URL
    if (buttonFromUrl) setButtonUrl(decodeURIComponent(buttonFromUrl)); // Set button image URL
    if (bkColorFromUrl) setBkColor(decodeURIComponent(bkColorFromUrl)); // Set background color
    if (tapTextFromUrl) setTapText(decodeURIComponent(tapTextFromUrl)); // Set tap text
    if (tapTextColorFromUrl) setTapTextColor(decodeURIComponent(tapTextColorFromUrl)); // Set tap text color
    if (mainTextFromUrl) setMainText(decodeURIComponent(mainTextFromUrl)); // Set main text


    // Vapi event listeners (same as before)
    vapi.on("call-start", () => {
      console.log('Call started');
      setConnecting(false);
      setConnected(true);
      setShowPublicKeyInvalidMessage(false);

      // Send the system prompt with phase_id after the call has started
      setTimeout(() => {
        sendPhaseIdPrompt();
      }, 1000); // Delay the sendPhaseIdPrompt call by 1 second
      setTimeout(() => {
        sendContext();
      }, 500);
    });

    vapi.on("call-end", () => {
      console.log('Call ended');
      setConnecting(false);
      setConnected(false);
      setIsPressed(false);  // Reset button state when call ends
      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });

    vapi.on("message", (message) => {
      console.log("Received message:", message);
    });
  }, [sendPhaseIdPrompt, sendContext]);

  const startCallInline = () => {
    if (!userId || !userName || !projectId || !assistantId) {
      alert("User ID, Name, Project, and Assistant ID are required. Please check the URL parameters.");
      return;
    }
    setConnecting(true);
    setIsPressed(true);  // Ensure the button stays in the pressed state when starting the call

    const assistantOverrides = {
      metadata: {
        user_id: userId,
        user_name: userName,
        project_id: projectId,
        phase_id: phaseId,
        context: context,
      },
    };

    console.log('Starting call with overrides:', assistantOverrides);
    vapi.start(assistantId, assistantOverrides);
  };

  const endCall = () => {
    setIsPressed(false);  // Reset the pressed state when ending the call
    vapi.stop();
  };


  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)", // Semi-transparent background
    }}>
      <div style={{ // Your existing app container style - ensure it's on top of video
          display: "flex",
          flexDirection: "column",
          width: "300px",
          height: "700px",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative", // Keep position relative for inner elements if needed - important!
          background: bkColor, // Use the custom background color
          borderRadius: "10px", // Rounded corners
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)", // Subtle glow effect
          zIndex: "1",
        }}>
        {videoUrl && <VideoBackground videoUrl={videoUrl} />} {/* Render VideoBackground as first child */}

        {/* Container for GIF and avatar */}
        <div style={{
          position: "relative",
          width: "300px",
          height: "300px",
          marginBottom: "10px",
        }}>
        {/* Lottie animation behind the avatar */}
          {animationUrl && (
            <LottiePlayer
              url={animationUrl}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "300px",
                height: "300px",
                objectFit: "cover",
                zIndex: "2",
              }}
            />
          )}

          {/* Avatar image on top */}
          {imgUrl && (
            <img
              src={imgUrl}
              alt="User Avatar"
              style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  width: "150x",  // Adjust the avatar size here
                  height: "150px", // Ensure it maintains a square shape
                  borderRadius: "30%",
                  objectFit: "cover",
                  transform: "translate(-50%, -60%)",  // Center the avatar in the container
                  zIndex: "2", // On top of the gif
                }}
            />
          )}
        </div>

        {/* Main text above tap text */}
        {mainText && (
          <div style={{
            fontSize: "15px",
            fontWeight: "normal",
            fontFamily: "'Noto Sans', sans-serif",
            color: tapTextColor, // Use the same color as tap text
            marginTop: "1px",
            marginBottom: "10px", // Reduce margin if main text exists
            textAlign: "center",
            zIndex: "1",
          }}>
            {mainText}
          </div>
        )}

        {/* Always show the "Tap to Talk" text */}
        <div style={{
          fontSize: "24px",
          fontWeight: "normal",
          fontFamily: "'Noto Sans', sans-serif",
          color: tapTextColor, // Use the custom text color
          marginTop: mainText ? "5px" : "10px", // Reduce margin if main text exists
          marginBottom: mainText ? "20px" : "20px", // Reduce margin if main text exists
          textAlign: "center",
          zIndex: "1",
        }}>
          {tapText}
        </div>

        {/* Call button */}
        <Button
          label={connected ? "End Call" : "Start Call"}
          onClick={connected ? endCall : startCallInline}
          isLoading={connecting}
          isPressed={isPressed}
          buttonUrl={buttonUrl} // Pass the custom button URL
        />

        {/* Reserved space for ActiveCallDetail */}
        <div style={{ height: "60px", width: "100%", zIndex: "1", }}>
          <ActiveCallDetail
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            connected={connected}
          />
        </div>

        {showPublicKeyInvalidMessage ? <PleaseSetYourPublicKeyMessage /> : null}
        {/* <ReturnToDocsLink /> */}
      </div>
    </div>
  );
};

// Define the usePublicKeyInvalid hook
const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] = useState(false);

  // Close public key invalid message after a delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

// Define the PleaseSetYourPublicKeyMessage component
const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        left: "25px",
        padding: "10px",
        color: "#fff",
        backgroundColor: "#f03e3e",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Is your Public Key missing? (recheck your code)
    </div>
  );
};

// Define the ReturnToDocsLink component
const ReturnToDocsLink = () => {
  return (
    <a
      href="https://www.voxdiscover.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        padding: "5px 10px",
        color: "#fff",
        textDecoration: "none",
        backgroundColor: "#333",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >

    </a>
  );
};


export default App;
// --- END OF FILE App.js ---
