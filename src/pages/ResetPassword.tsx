import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/auth");
  }, [navigate]);

  return null;
};

export default ResetPassword;
