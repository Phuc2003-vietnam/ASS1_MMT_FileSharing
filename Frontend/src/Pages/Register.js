import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { MainLogo } from "../Icons/Icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";

const schema = yup.object().shape({
  hostname: yup.string().required("hostname is required"),
  password: yup.string().min(3).max(32).required("password is required"),
  confirmPwd: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match")
    .min(6)
    .max(32)
    .required("confirm password is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await ServerServiceApi.register(data);

      if (response.status === 200) {
        navigate("/Login");
      } else {
        console.log("Register failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <div className="registerContainter w-[440px]  rounded-lg bg-[#5A6465] shadow-lg shadow-cyan-500/50">
      <div className="header flex items-center justify-center mt-[20px]">
        <MainLogo></MainLogo>
        <h1 className="font-bold text-[30px] text-[#66FCF1] ml-4">
          File-Sharing Register
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
            {errors?.hostname?.message}
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
            className="w-[400px] h-[60px] bg-[white] text-[24px] px-4 outline-none rounded-lg"
          />
          <span className="text-[orange] text-[24px]">
            {errors?.password?.message}
          </span>
        </div>

        <div className="flex flex-col w-full items-center my-[24px]">
          <label
            htmlFor="confirmPwd"
            className="text-[24px] font-bold inline-block w-full pl-[20px] mb-[15px]"
          >
            Confirm password
          </label>
          <input
            {...register("confirmPwd")}
            name="confirmPwd"
            type="password"
            id="confirmPwd"
            className="w-[400px] h-[60px] bg-[white] text-[24px]  px-4 outline-none rounded-lg"
          />
          <span className="text-[orange] text-[24px]">
            {errors?.confirmPwd?.message}
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#66FCF1] w-[400px] h-[60px] p-2 mx-auto block rounded-lg mt-[47px] text-[24px] font-bold"
        >
          Create User
        </button>
      </form>

      <div className="flex items-center justify-center text-[24px] font-bold my-[25px]">
        Adready have an account?
        <Link to="/Login">
          <span className="text-[#66FCF1] decoration-none ml-2">Login</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
