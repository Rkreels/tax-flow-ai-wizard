
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // This component simply redirects to the Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
