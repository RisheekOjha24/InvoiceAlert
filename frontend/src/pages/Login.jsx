import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { signin } from "../utils/APIRoute";
import frontImage from "../assets/invoiceImage.jpeg";

const Container = styled("div")({
  display: "flex",
  minHeight: "100vh",
});

const StyledImage = styled("img")({

  maxHeight: "99.5vh",
  objectFit: "cover",
});

const RightPane = styled("div")({
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  padding: "20px",
});



const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    try {

      const decoded = jwtDecode(credentialResponse.credential);
  
      const { name, email } = decoded;

      const response = await axios.post(signin, { name, email });

      const { user } = response.data;

      localStorage.setItem("user", JSON.stringify({ name, email }));

      console.log("Sign in successful:", user);

      navigate("/invoices"); 
    } catch (error) {
      console.error("Sign in error:", error);
      
    }
  };

  return (
    <Container>
      <div style={{ flex: 1 }}>
        <StyledImage src={frontImage} alt="Welcome" />
      </div>
      <RightPane>
        <div style={{padding:"20px" ,border:"2px solid black"}}>
          <GoogleOAuthProvider clientId="1026617270799-ac4m3lfuarba592tii7gq5k5p28s31ml.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
              render={(renderProps) => (
                <div
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Sign in with Google
                </div>
              )}
            />
          </GoogleOAuthProvider>
        </div>
      </RightPane>
    </Container>
  );
};

export default Login;
