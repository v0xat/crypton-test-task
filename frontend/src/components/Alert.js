import React from "react";

const Alert = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="alert alert-danger m-3" role="alert">
      {message}
    </div>
  );
}

export default Alert;