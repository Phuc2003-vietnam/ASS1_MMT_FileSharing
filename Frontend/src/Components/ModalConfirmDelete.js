import React, { useState } from "react";
import CenterModal from "./CenterModal";
import RepositoryApi from "../APIs/P2pAPI/RepositoryApi";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";
import axios from "axios";
import { Loading } from "../Icons/Icons";

const ModalConfirmDelete = ({
  children,
  message,
  fileName,
  handleReloadRepo,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = async () => {
    setOpenModal(false);
  };

  const hostName = localStorage.getItem("hostname");

  const updateHostRepoToServer = async () => {
    try {
      const newListFile = await RepositoryApi.getList();
      const fileInfo = {
        hostname: hostName,
        file: newListFile.data.files,
      };
      console.log("send data Notice to Server", fileInfo);
      await ServerServiceApi.uploadFileInfo(fileInfo);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const data = { fileName: fileName };

  const [load, setLoad] = useState(false);

  const handleConfirm = async () => {
    setLoad(true);

    const response = await axios.post("http://localhost:8080/fileInRepo", data);

    console.log("delete Response", response);

    setTimeout(async () => {
      await updateHostRepoToServer();
      await handleReloadRepo();
      setLoad(false);
      setOpenModal(false);
    }, 500);
  };

  return (
    <>
      <div onClick={() => setOpenModal(true)}> {children}</div>
      <CenterModal open={openModal} handleClose={handleClose}>
        <div className="w-[350px] md:w-[400px] overflow-hidden rounded-lg">
          <div className="header bg-[#252A33] text-white text-[24px] font-bold flex items-center justify-center h-[60px] w-full">
            XÁC NHẬN
          </div>
          <div className="flex items-center justify-center text-[20px] font-semibold h-[100px] ">
            {load ? (
              <span className="animate-spin">
                <Loading></Loading>
              </span>
            ) : (
              message
            )}
          </div>
          <div className="flex items-center gap-3 justify-center w-full py-2">
            <button
              className="bg-[#a93e3e] p-3 w-[40%] block rounded-lg text-[20px] font-semibold text-white"
              onClick={handleClose}
            >
              Hủy bỏ
            </button>
            <button
              className="bg-[#4a4a8e] p-3 w-[40%] block rounded-lg text-[20px] font-semibold text-white"
              onClick={handleConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </CenterModal>
    </>
  );
};

export default ModalConfirmDelete;
