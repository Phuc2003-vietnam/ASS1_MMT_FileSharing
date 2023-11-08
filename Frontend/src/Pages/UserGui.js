import React from "react";
import ClientGui from "./ClientGui";
import AdminGui from "./AdminGui";

const UserGui = () => {
  const hostName = localStorage.getItem("hostname");
  const passWord = localStorage.getItem("password");

  return (
    <>
      {hostName === "admin123" && passWord === "admin123" ? (
        <AdminGui></AdminGui>
      ) : (
        <ClientGui></ClientGui>
      )}
    </>
  );
};

export default UserGui;
