import { useEffect } from "react";

import { useNavigate }
from "react-router-dom";

export default function LoginSuccess() {

  const navigate = useNavigate();

  useEffect(() => {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (token) {

      localStorage.setItem(
        "token",
        token
      );

      navigate("/");
    }

  }, []);

  return (

    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >

      Logging in...

    </div>
  );
}