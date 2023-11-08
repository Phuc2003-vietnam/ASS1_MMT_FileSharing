import React, { useState } from "react";
import CenterModal from "./CenterModal";
import RepositoryApi from "../APIs/P2pAPI/RepositoryApi";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";
import { Loading } from "../Icons/Icons";

const ModalConfirmDownLoad = ({
  children,
  message,
  hostIp,
  fileName,
  nodeId,
  handleReloadRepo,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  };

  const fetchParams = {
    clientIp: hostIp,
    clientPort: 3000,
    fileName: fileName,
    nodeId: nodeId,
  };

  const hostName = localStorage.getItem("hostname");
  const updateHostRepoToServer = async () => {
    try {
      const newListFile = await RepositoryApi.getList();
      const fileInfo = {
        hostname: hostName,
        file: newListFile.data.files,
      };
      // call api thong bao den server
      console.log("send data Notice to Server", fileInfo);
      await ServerServiceApi.uploadFileInfo(fileInfo);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  // call API fetch file
  const [load, setLoad] = useState(false);

  const handelConfirm = async () => {
    try {
      setLoad(true);

      const response = await RepositoryApi.fetchFile(fetchParams);
      console.log(response);

      setTimeout(async () => {
        await updateHostRepoToServer();
        await handleReloadRepo();
      }, 500);
    } catch (error) {
      console.error("Error fetching file", error);
    }
    setLoad(false);
    setOpenModal(false);
  };

  return (
    <>
      <div onClick={() => setOpenModal(true)}> {children}</div>
      <CenterModal open={openModal} handleClose={handleClose}>
        <div className="w-[350px] md:w-[400px] overflow-hidden rounded-lg">
          <div className="header bg-[#252A33] text-white text-[24px] font-bold flex items-center justify-center h-[60px] w-full">
            XÁC NHẬN
          </div>
          <div className="flex items-center text-center justify-center text-[20px] font-semibold h-[100px] ">
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
              onClick={handelConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </CenterModal>
    </>
  );
};

export default ModalConfirmDownLoad;
