import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MainLogo } from "../Icons/Icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import HostnameApi from "../APIs/ServerAPI/ServerServiceApi";
import axios from "axios";

const schema = yup.object().shape({
  hostname: yup.string().required("Hostname is required"),
  password: yup.string().min(2).max(32).required("Password is required"),
});

const Login = () => {
  const { formState, register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const nodeId = await axios.get("http://localhost:8080/nodeId");
      console.log(nodeId);

      const NewData = {
        ...data,
        nodeId: nodeId.data.nodeId,
      };
      console.log(NewData);
      const response = await HostnameApi.login(NewData);
      if (response.status === 200) {
        localStorage.setItem("hostname", data.hostname);
        localStorage.setItem("password", data.password);
        navigate("/UserGui");
      } else {
        console.log("Login failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      console.log(error.response.data);
    }
  };

  return (
    <div className="registerContainter w-[440px] rounded-lg bg-[#5A6465] shadow-lg shadow-cyan-500/50">
      <div className="header flex items-center justify-center mt-[20px]">
        <MainLogo></MainLogo>
        <h1 className="font-bold text-[30px] text-[#66FCF1] ml-4">
          File-Sharing Login
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full items-center my-[24px]">
          <label
            htmlFor="hostname"
            className="text-[24px] font-bold inline-block w-full pl-[20px] mb-[15px]"
          >
            Hostname
          </label>
          <input
            {...register("hostname")}
            name="hostname"
            type="text"
            id="hostname"
            className="w-[400px] h-[60px] bg-[white] text-[24px]  px-4 outline-none rounded-lg"
          />
          <span className="text-[orange] text-[24px]">
            {formState.errors.hostname?.message}
          </span>
        </div>

        <div className="flex flex-col w-full items-center my-[24px]">
          <label
            htmlFor="password"
            className="text-[24px] font-bold inline-block w-full pl-[20px] mb-[15px]"
          >
            Password
          </label>
          <input
            {...register("password")}
            name="password"
            type="password"
            id="password"
            className="w-[400px] h-[60px] bg-[white] text-[24px]  px-4 outline-none rounded-lg"
          />
          <span className="text-[orange] text-[24px]">
            {formState.errors.password?.message}
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#66FCF1] w-[400px] h-[60px] p-2 mx-auto block rounded-lg mt-[47px] text-[24px] font-bold"
        >
          Login
        </button>
      </form>

      <div className="flex items-center justify-center text-[24px] font-bold my-[25px]">
        Don't have an account?
        <Link to="/Register">
          <span className="text-[#66FCF1] decoration-none ml-2">Register</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
