import { useEffect, useState } from "react";
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
  const [assistantId, setAssistantId] = useState("");
  const [imgUrl, setImgUrl] = useState(""); // New state for image URL
  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } = usePublicKeyInvalid();

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    const nameFromUrl = urlParams.get('name');
    const projectFromUrl = urlParams.get('project');
    const assistantFromUrl = urlParams.get('assistant_id');
    const imgFromUrl = urlParams.get('img_url'); // Get image URL from parameters

    if (idFromUrl) setUserId(idFromUrl);
    if (nameFromUrl) setUserName(decodeURIComponent(nameFromUrl));
    if (projectFromUrl) setProjectId(decodeURIComponent(projectFromUrl));
    if (assistantFromUrl) setAssistantId(assistantFromUrl);
    if (imgFromUrl) setImgUrl(decodeURIComponent(imgFromUrl)); // Set image URL state

    // Vapi event listeners
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
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
      console.error(error);
      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });

    vapi.on("message", (message) => {
      console.log("Received message:", message);
    });
  }, []);

  const startCallInline = () => {
    if (!userId || !userName || !projectId || !assistantId) {
      alert("User ID, Name, Project, and Assistant ID are required. Please check the URL parameters.");
      return;
    }
    setConnecting(true);

    // Create assistantOverrides with metadata
    const assistantOverrides = {
      metadata: {
        user_id: userId,
        user_name: userName,
        project_id: projectId,
      },
    };

    // Use the assistant ID from the URL parameter and pass assistantOverrides
    vapi.start(assistantId, assistantOverrides);
  };

  const endCall = () => {
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
    }}>
      {!connected ? (
        <>
          <div>User ID: {userId}</div>
          <div>User Name: {userName}</div>
          <div>User Project: {projectId}</div>
          <div>Assistant ID: {assistantId}</div>
          <Button
            label="Start Call"
            onClick={startCallInline}
            isLoading={connecting}
            imgUrl={imgUrl} // Pass image URL to button
          />
        </>
      ) : (
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          onEndCallClick={endCall}
          imgUrl={imgUrl} // Pass image URL to ActiveCallDetail
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
      /*href="https://callr.ai"*/
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        padding: "5px 10px",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Please push the button to talk.
    </a>
  );
};

export default App;
