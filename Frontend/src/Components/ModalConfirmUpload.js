import React, { useState } from "react";
import CenterModal from "./CenterModal";
import RepositoryApi from "../APIs/P2pAPI/RepositoryApi";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";
import axios from "axios";

const ModalConfirmUpload = ({
  children,
  message,
  file,
  handleReloadSystem,
  handleReloadRepo,
  hostName,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await axios
      .post("http://localhost:8080/uploadRepo", formData)
      .then(() => {
        console.log("Upload Success");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Upload Repo Response", Response);

    // lay danh sach file moi
    const newListFile = await RepositoryApi.getList();

    const fileInfo = {
      hostname: hostName,
      file: newListFile.data.files,
    };

    // call api thong bao den server

    setTimeout(async () => {
      console.log("send data Notice to Server", fileInfo);
      const responseNotice = await ServerServiceApi.uploadFileInfo(fileInfo);
      console.log("Update to Server", responseNotice);
      setOpenModal(false);
      await handleReloadRepo();
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
            {message}
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

export default ModalConfirmUpload;
