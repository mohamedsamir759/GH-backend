import React from "react";

function CardWrapper({ children, className }) {
  return (
    <div className={`card_wrapper ${className ? className : ""}`}>
      {children}
    </div>

  );
}

export default CardWrapper;