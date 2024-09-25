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
      flexDirection: "column",
      width: "100vw",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}>
      {/* Always show the avatar */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt="User Avatar"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "50px",
          }}
        />
      )}

      {/* Always show the "Tap to Talk" text */}
      <div style={{
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "'Poppins', sans-serif",
        padding: "50px 0",
        color: "white",
      }}>
        Tap to talk:
      </div>

      {/* Conditionally show the button or call details */}
      <Button
        label={connected ? "End Call" : "Start Call"}
        onClick={connected ? endCall : startCallInline}
        isLoading={connecting}
        isPressed={isPressed}
      />

      {connected && (
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
        />
      )}
      

      {showPublicKeyInvalidMessage ? <PleaseSetYourPublicKeyMessage /> : null}
      <ReturnToDocsLink />
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
