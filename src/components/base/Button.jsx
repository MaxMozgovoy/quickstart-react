import ScaleLoader from "react-spinners/ScaleLoader";

const Button = ({ label, onClick, isLoading, disabled, imgUrl }) => {
  const opacity = disabled ? 0.75 : 1;
  const cursor = disabled ? "not-allowed" : "pointer";

  // Display loader or text label based on the loading state
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
        backgroundColor: imgUrl ? "transparent" : "blue", // Keep background transparent if image is provided
        color: "white",
        border: "2px solid #ddd",
        borderRadius: "50%", 
        padding: "10px 20px",
        fontSize: "16px",
        outline: "none",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        opacity,
        cursor,
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: imgUrl ? `url(${imgUrl})` : "none", // Keep the image as background
        backgroundSize: "cover", // Cover the entire button with the image
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
      disabled={disabled} // Keep the button disabled if required
    >
      {Contents}
    </button>
  );
};

export default Button;
