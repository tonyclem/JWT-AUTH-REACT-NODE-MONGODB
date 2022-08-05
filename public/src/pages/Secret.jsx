import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Secret() {
  const navigation = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies([]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.token) {
        navigation("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:8080",
          {},
          { withCredentials: true }
        );
        if (!data.status) {
          removeCookie("token");
          navigation("/login");
        } else toast(`HI ${data.user}`, { theme: "dark" });
      }
    };
    verifyUser();
  }, [cookies, navigation, removeCookie]);

  const logOut = () => {
    removeCookie("token");
    navigation("/register");
  };

  return (
    <>
      <div className="private">
        <h1>Super Secret Page</h1>
        <button onClick={logOut}>Log Out</button>
      </div>
      <ToastContainer />
    </>
  );
}
