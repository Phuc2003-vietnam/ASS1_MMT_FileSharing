import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";
import { MainLogo, UserIcon } from "../Icons/Icons";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";

const Header = () => {
  const hostName = localStorage.getItem("hostname");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const hostname = await localStorage.getItem("hostname");
    const data = { hostname: hostname };
    try {
      const Response = ServerServiceApi.logout(data);
      console.log("Logout Response", Response);
    } catch (error) {
      console.log("Logout error", error);
    }
    await localStorage.removeItem("hostname");
    await localStorage.removeItem("password");
    navigate("/Login");
  };

  return (
    <div className="header flex items-center justify-between px-[50px] mt-[25px] mb-[35px]">
      <div className="systemName flex items-center justify-center">
        <MainLogo></MainLogo>
        <h1 className="font-bold text-[34px] text-[#66FCF1] ml-4">
          File-Sharing
        </h1>
      </div>
      <div className="w-[300px] h-[60px] flex items-center justify-center gap-2 text-[30px] font-bold text-[#0f2c2a] -translate-x-10">
        <span
          htmlFor="gui"
          onClick={() => {
            navigate("/UserGui");
          }}
          className="cursor-pointer hover:text-[gray] transition-all"
        >
          GUI
        </span>
        <span
          htmlFor="terminal"
          className="ml-4 cursor-pointer  hover:text-[gray] transition-all"
          onClick={() => {
            navigate("/UserTerminal");
          }}
        >
          TERMINAL
        </span>
      </div>
      <div className="userName flex items-center justify-between cursor-pointer">
        <UserIcon></UserIcon>
        <Popover placement="bottom">
          <PopoverHandler>
            <Button>
              <span className="font-semibold text-[24px] ml-4 text-[#66FCF1] capitalize">
                {hostName}
              </span>
            </Button>
          </PopoverHandler>
          <PopoverContent className="bg-transparent -translate-y-5 border-none">
            <div className="w-[250px] bg-[#1F2333] shadow-lg shadow-cyan-500/50 rounded-[5px] p-3 m-0">
              <p className=" text-center text-[20px] font-bold  text-white mb-3">
                Change account?
              </p>

              <button
                className="p-3 bg-[#66FCF1] w-[80%] mx-auto block rounded-md font-bold text-[20px]"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
