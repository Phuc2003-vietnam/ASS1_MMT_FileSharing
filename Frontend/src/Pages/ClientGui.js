import React, { useEffect, useState } from "react";
import { SearchIcon, UploadIcon } from "../Icons/Icons";
import { CommunityFileItem, RepoFileItem } from "../Components/FileItem";
import Header from "../Components/Header";
import ModalConfirmUpload from "../Components/ModalConfirmUpload";
import RepositoryApi from "../APIs/P2pAPI/RepositoryApi";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";

const ClientGui = () => {
  const [file, setFile] = useState();
  const [fileOnSystem, setFileOnSystem] = useState([]);
  const [fileOnRepo, setFileOnRepo] = useState([]);
  const hostName = localStorage.getItem("hostname");
  const [fileSearch, setFileSearch] = useState("");

  const updateHostRepoToServer = async () => {
    try {
      const newListFile = await RepositoryApi.getList();
      const fileInfo = {
        hostname: hostName,
        file: newListFile.data.files,
      };
      // call api thong bao den server
      await ServerServiceApi.uploadFileInfo(fileInfo);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const fetchListFileOnRepository = async () => {
    try {
      const response = await RepositoryApi.getList();
      setFileOnRepo(response.data.files); // Assuming response.data is an array of file names
      console.log("ALL FIlE ON REPOSITORY", response.data.files);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const fetchListFileOnServer = async () => {
    try {
      const response = await ServerServiceApi.getListFile();
      console.log("ALL FIlE ON SYSTEM", response.data.currentFiles);
      setFileOnSystem(response.data.currentFiles);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const handleSearchFile = async () => {
    try {
      if (fileSearch === "") {
        fetchListFileOnServer();
      } else {
        const data = { searchString: fileSearch };
        const response = await ServerServiceApi.searchFile(data);
        console.log("SEARCH FILE ON SYSTEM", response.data.currentFiles);
        setFileOnSystem(response.data.currentFiles);
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateHostRepoToServer();
      } catch (error) {
        console.error("Error updating data to server:", error);
      }

      const intervalId = setInterval(() => {
        fetchListFileOnServer();
      }, 10000);

      fetchListFileOnServer();
      fetchListFileOnRepository();

      return () => clearInterval(intervalId);
    };

    fetchData();
  }, []);

  return (
    <div className="homeContainter w-[1200px] h-[900px] rounded-lg bg-[#5A6465] shadow-lg shadow-cyan-500/50">
      <Header></Header>
      <div className="Maincontent w-[1100px] h-[750px] mx-auto flex items-center justify-between">
        <div className="w-[49%] h-[100%] bg-[#252A33] rounded-lg">
          <h1 className="text-[26px] text-[#66FCF1] text-center font-bold mt-2">
            Community Files
          </h1>
          <div className="Search px-3 text-[25px] bg-white rounded-md w-[90%] h-[60px] flex items-center justify-between mx-auto mt-4 overflow-hidden">
            <input
              type="text"
              placeholder="Search file"
              className="w-[90%] h-full text-[20px] outline-none px-3"
              onInput={async (e) => {
                setFileSearch(e.target.value);
                handleSearchFile();
              }}
            />
            <div onClick={handleSearchFile}>
              <SearchIcon></SearchIcon>
            </div>
          </div>
          <div className="Search p-4 text-[25px] bg-white rounded-lg w-[90%] h-[78%] mt-5 mx-auto overflow-y-auto">
            {fileOnSystem.map((fileItem, index) => (
              <CommunityFileItem
                fileName={fileItem?.file.name}
                fileSize={fileItem?.file.size}
                hostIp={fileItem.localIp}
                nodeId={fileItem.nodeId}
                key={index}
                handleReloadRepo={fetchListFileOnRepository}
              ></CommunityFileItem>
            ))}
          </div>
        </div>
        <div className="w-[49%] h-[100%] bg-[#252A33] rounded-lg">
          <h1 className="text-[26px] text-[#66FCF1] text-center font-bold mt-2">
            Repository
          </h1>
          <div className="Search text-[25px] bg-white rounded-md w-[90%] h-[60px] flex items-center justify-between mx-auto mt-4 overflow-hidden px-4">
            <input
              id="newFile"
              type="file"
              className="rounded-md mx-2 font-semibold text-[blue] text-[20px]"
              onChange={(event) => {
                const selectedFile = event.target.files[0];
                setFile(selectedFile);
                // console.log(selectedFile.name);
              }}
            />
            <ModalConfirmUpload
              message={`Confirm upload File`}
              file={file}
              hostName={hostName}
              handleReloadRepo={fetchListFileOnRepository}
              handleReloadSystem={fetchListFileOnServer}
            >
              <UploadIcon></UploadIcon>
            </ModalConfirmUpload>
          </div>
          <div className="Search p-4 text-[25px] bg-white rounded-lg w-[90%] h-[78%] mt-5 mx-auto  overflow-y-auto">
            {fileOnRepo.map((fileItem, index) => (
              <RepoFileItem
                fileName={fileItem?.name}
                fileSize={fileItem?.size}
                key={index}
                handleReloadRepo={fetchListFileOnRepository}
              ></RepoFileItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientGui;
