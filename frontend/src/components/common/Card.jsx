const Card = ({ children, className = "", onClick, hover = false }) => {
  return (
    <div
      className={`card-elevated ${hover ? "card-hover" : ""} p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
