import ScaleLoader from "react-spinners/ScaleLoader";

const Button = ({ label, onClick, isLoading, disabled }) => {
  const opacity = disabled ? 0.75 : 1;
  const cursor = disabled ? "not-allowed" : "pointer";

  const Contents = isLoading ? (
    <ScaleLoader
      color="#000"
      height={10}
      width={2.5}
      margin={0.5}
      loading={true}
      size={50}
      css={{ display: "block", margin: "0 auto" }}
    />
  ) : (
    <p style={{ margin: 0, padding: 0 }}>{label}</p>
  );

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "blue",  // Change background color to light blue
        color: "white",
        border: "2px solid #ddd",
        borderRadius: "50%",  // Make the button round
        padding: "10px 20px",  // Adjust padding to create a round shape
        fontSize: "16px",
        outline: "none",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        opacity,
        cursor,
        width: "100px",  // Set width for the round button
        height: "100px", // Set height for the round button
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {Contents}
    </button>
  );
};

export default Button;
