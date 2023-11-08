import React from "react";
import TerminalController from "../Components/TerminalController";
import Header from "../Components/Header";

const UserTerminal = () => {
  return (
    <div className="homeContainter w-[1200px] h-[900px] rounded-lg bg-[#5A6465] shadow-lg shadow-cyan-500/50">
      <Header></Header>
      <div className="terminal w-[1100px] h-[750px] mx-auto">
        <TerminalController></TerminalController>
      </div>
    </div>
  );
};

export default UserTerminal;
