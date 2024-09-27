import { useEffect, useState, useCallback } from "react";
import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import Vapi from "@vapi-ai/web";
import { isPublicKeyMissingError } from "./utils";

// Put your Vapi Public Key below.
const vapi = new Vapi("1d2b5be0-8598-4d46-b95f-e738be2a8742");

const App = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [phaseId, setPhaseId] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isPressed, setIsPressed] = useState(false);  // New state for button press
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

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    const nameFromUrl = urlParams.get('name');
    const projectFromUrl = urlParams.get('project');
    const assistantFromUrl = urlParams.get('assistant_id');
    const phaseFromUrl = urlParams.get('phase_id');
    const imgFromUrl = urlParams.get('img_url');

    if (idFromUrl) setUserId(idFromUrl);
    if (nameFromUrl) setUserName(decodeURIComponent(nameFromUrl));
    if (projectFromUrl) setProjectId(decodeURIComponent(projectFromUrl));
    if (assistantFromUrl) setAssistantId(assistantFromUrl);
    if (phaseFromUrl) {
      setPhaseId(phaseFromUrl);
      console.log(`Phase ID set from URL: ${phaseFromUrl}`);
    }
    if (imgFromUrl) setImgUrl(decodeURIComponent(imgFromUrl));

    // Vapi event listeners
    vapi.on("call-start", () => {
      console.log('Call started');
      setConnecting(false);
      setConnected(true);
      setShowPublicKeyInvalidMessage(false);

      // Send the system prompt with phase_id after the call has started
      setTimeout(() => {
        sendPhaseIdPrompt();
      }, 1000); // Delay the sendPhaseIdPrompt call by 1 second
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
  }, [sendPhaseIdPrompt]);

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
    <div style={{
  display: "flex",
  flexDirection: "column",
  width: "300px",
  height: "600px",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  boxSizing: "border-box",
  overflow: "hidden",
  position: "relative",
  background: "#000", // Black background for the app container
  borderRadius: "10px", // Rounded corners
  boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)", // Subtle glow effect
}}>

  {/* Container for GIF and avatar */}
  <div style={{
    position: "relative",
    width: "300px",
    height: "300px",
    marginBottom: "20px",
  }}>
    {/* Animated GIF behind the avatar */}
    <img
      src="https://ufnmrdffbnmwfyisnkfu.supabase.co/storage/v1/object/public/photo/files/Brayn/Flow%201@1x-50fps.gif"
      alt="Animated Background"
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        //width: "100%",
        //height: "100%",
        width: "300px",
        height: "300px",
        objectFit: "cover", // Ensure the gif covers the container
        zIndex: "1", // Behind the avatar
      }}
    />

    {/* Avatar image on top */}
    {imgUrl && (
      <img
        src={imgUrl}
        alt="User Avatar"
        style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "150px",  // Adjust the avatar size here
            height: "150px", // Ensure it maintains a square shape
            borderRadius: "50%",
            objectFit: "cover",
            transform: "translate(-50%, -60%)",  // Center the avatar in the container
            zIndex: "2", // On top of the gif
          }}
      />
    )}
  </div>

  {/* Always show the "Tap to Talk" text */}
  <div style={{
    fontSize: "24px",
    fontWeight: "bold",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    marginTop: "10px",
    textAlign: "center",
  }}>
    Tap to talk:
  </div>

  {/* Call button */}
  <Button
    label={connected ? "End Call" : "Start Call"}
    onClick={connected ? endCall : startCallInline}
    isLoading={connecting}
    isPressed={isPressed}
  />

  {/* Reserved space for ActiveCallDetail */}
  <div style={{ height: "60px", width: "100%" }}>
    <ActiveCallDetail
      assistantIsSpeaking={assistantIsSpeaking}
      volumeLevel={volumeLevel}
      connected={connected}
    />
  </div>

  {showPublicKeyInvalidMessage ? <PleaseSetYourPublicKeyMessage /> : null}
  <ReturnToDocsLink />
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
      href="https://callr.ai"
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
