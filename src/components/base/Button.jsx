const Button = ({ onClick, isLoading, isPressed, label }) => {
    const handleButtonClick = () => {
      if (!isLoading) {
        onClick();
      }
    };
  
    return (
      <button
        onClick={handleButtonClick}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          opacity: "100%",
          backgroundImage: isPressed
            ? 'url("https://ufnmrdffbnmwfyisnkfu.supabase.co/storage/v1/object/public/photo/files/Brayn/echo_mic-2.jpg")'
            : 'url("https://ufnmrdffbnmwfyisnkfu.supabase.co/storage/v1/object/public/photo/files/Brayn/echo_mic-1.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
        disabled={isLoading}
        aria-label={label}
      />
    );
  };
  
  export default Button;