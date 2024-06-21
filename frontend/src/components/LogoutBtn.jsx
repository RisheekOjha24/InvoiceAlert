import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styled from "styled-components";
import { RiLogoutCircleLine } from "react-icons/ri";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const tellme = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log out",
      width: "25rem",
    });

    if (!tellme.isConfirmed) return;

    googleLogout();
    console.log("User logged out.");
    localStorage.clear();
    navigate("/"); //redirecting to login page
  };

  return (
    <StyledButton onClick={handleLogout}>
      <RiLogoutCircleLine />
      <ButtonText>Sign Out</ButtonText>
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding:5px 8px;
  margin:1rem;
  background: linear-gradient(45deg, #ff6b6b, #f06595);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 14px;

  svg {
    font-size: 20px;
    margin-right: 0.5rem;
  }

  &:hover {
    background: linear-gradient(45deg, #f06595, #ff6b6b);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonText = styled.span`
  font-weight: bold;
`;

export default LogoutButton;
