import React from "react";
import { DownloadIcon, RemoveIcon } from "../Icons/Icons";
import ModalConfirmDownLoad from "./ModalConfirmDownload";
import ModalConfirmDelete from "./ModalConfirmDelete";

export const CommunityFileItem = ({
  fileName,
  fileSize,
  hostIp,
  nodeId,
  handleReloadRepo,
}) => {
  // console.log(fileName, hostIp, nodeId);
  return (
    <div className="w-[90%] p-2 pr-4 bg-[#D9D9D9] border-b-4 border-black rounded-md mx-auto text-[20px] my-2 font-semibold text flex justify-between items-center hover:bg-gray-400 transition-all ">
      <span className="w-[90%] flex justify-between">
        <span className="w-80% truncate text-blue-500 "> {fileName} </span>
        <span className=""> {fileSize} </span>
      </span>
      <ModalConfirmDownLoad
        message={`Confirm download this ${fileName}`}
        hostIp={hostIp}
        nodeId={nodeId}
        fileName={fileName}
        handleReloadRepo={handleReloadRepo}
      >
        <DownloadIcon />
      </ModalConfirmDownLoad>
    </div>
  );
};

export const RepoFileItem = ({ fileName, fileSize, handleReloadRepo }) => {
  return (
    <div className="w-[90%] p-2 pr-4 bg-[#D9D9D9] border-b-4 border-black rounded-md mx-auto text-[20px] my-2 font-semibold text flex justify-between items-center hover:bg-gray-400 transition-all">
      <span className="w-[90%] flex justify-between">
        <span className="w-80% truncate text-blue-500 "> {fileName} </span>
        <span className=""> {fileSize} </span>
      </span>
      <ModalConfirmDelete
        message={`Confirm delete this ${fileName}`}
        fileName={fileName}
        handleReloadRepo={handleReloadRepo}
      >
        <RemoveIcon />
      </ModalConfirmDelete>
    </div>
  );
};
