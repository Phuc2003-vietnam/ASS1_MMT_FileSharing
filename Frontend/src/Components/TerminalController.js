import React, { useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import RepositoryApi from "../APIs/P2pAPI/RepositoryApi";
import ServerServiceApi from "../APIs/ServerAPI/ServerServiceApi";
// import axios from "axios";
// import { baseURL } from "../APIs/ServerAPI/BaseServerApi";

const TerminalController = (props = {}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Welcome to the File Sharing Application</TerminalOutput>,
  ]);

  const hostName = localStorage.getItem("hostname");
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

  const handleInput = async (terminalInput) => {
    const inputTokens = terminalInput.split(" ");

    if (inputTokens[0] === "myRepository") {
      try {
        const response = await RepositoryApi.getList();
        const files = response.data.files;
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          ...files.map((file, index) => (
            <TerminalOutput key={index}>
              <span className="w-[500px] flex justify-between">
                <span className="w-[80%] truncate text-blue-500 ">
                  {file?.name || "Null"}
                </span>
                <span className="text-blue-500"> {file?.size || "Null"} </span>
              </span>
            </TerminalOutput>
          )),
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in myRepository feature", error);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">
              {"Error in myRepository feature"}
            </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "communityFile") {
      try {
        const response = await ServerServiceApi.getListFile();
        const files = response.data.currentFiles;
        console.log(files);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{"$ communityFile"}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          ...files.map((fileItem, index) => (
            <TerminalOutput key={index}>
              <span className="w-[700px] flex justify-between">
                <span className="w-[500px] flex justify-between">
                  <span className="w-[80%] truncate  text-blue-500">
                    {fileItem?.file.name || "Null"}
                  </span>
                  <span className="text-blue-500">
                    {fileItem?.file.size || "Null"}
                  </span>
                </span>
                <span> ({fileItem.localIp})</span>
              </span>
            </TerminalOutput>
          )),
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in communityFile feature", error);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">
              {"Error in communityFile feature"}
            </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "publish") {
      if (inputTokens.length < 3) {
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{"Command Error"}</TerminalOutput>,
        ]);
      } else {
        try {
          const response = await RepositoryApi.publishFile({
            lname: inputTokens[1],
            fname: inputTokens[2],
          });
          console.log("publish Response", response);

          // gưi thong bao den main server
          updateHostRepoToServer();
          // cho thong bao upload thanh cong

          setTerminalLineData((prevData) => [
            ...prevData,
            <TerminalOutput>{`$ publish ${inputTokens[1]} ${inputTokens[2]}`}</TerminalOutput>,
            <TerminalOutput>
              {"---------------------------------"}
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
            <TerminalOutput>
              <span className="text-[yellow]">Upload file success</span>
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
          ]);
        } catch (error) {
          console.log("Error in Publish feature", error);
          setTerminalLineData((prevData) => [
            ...prevData,
            <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
            <TerminalOutput>
              {"---------------------------------"}
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
            <TerminalOutput>
              <span className="text-[yellow]">
                {"Error in Publish feature"}
              </span>
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
          ]);
        }
      }
    } else if (inputTokens[0] === "delete") {
      try {
        const data = {
          fileName: inputTokens[1],
        };

        console.log("Delete data", data);

        const response = await RepositoryApi.deleteFile(data);
        if (response.status === 200) {
          console.log("File deleted successfully");
        }
        console.log("delete Response", response);

        updateHostRepoToServer();

        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ delete ${inputTokens[1]}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">Delete file success</span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.error(error);
      }
    } else if (inputTokens[0] === "fetch") {
      let localIP = -1;
      let nodeId = -1;

      console.log(inputTokens);

      try {
        const response = await ServerServiceApi.getListFile();
        const files = response.data.currentFiles;
        console.log(files);
        for (let i = 0; i < files.length; i++) {
          const fileItem = files[i];
          if (fileItem.file.name === inputTokens[1]) {
            localIP = fileItem.localIp;
            nodeId = fileItem.nodeId;
            if (inputTokens[2] === null) {
              localIP = fileItem.localIp;
              nodeId = fileItem.nodeId;
              console.log("take the first file");
              break;
            } else if (inputTokens[2] === fileItem.localIP) {
              localIP = fileItem.localIp;
              nodeId = fileItem.nodeId;
              console.log("take the file follow lolcalIP");
              break;
            }
          }
        }
      } catch (error) {
        console.log("Error in Fetch feature - data", error);
      }

      if (localIP === -1) {
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ fetch ${inputTokens[1]}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">
              {"FileName or IP address not found!"}
            </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      } else {
        const fetchParams = {
          clientIp: localIP,
          nodeId: nodeId,
          clientPort: 3000,
          fileName: inputTokens[1],
        };

        console.log("fetchParamsv form terminal", fetchParams);

        try {
          const response = await RepositoryApi.fetchFile(fetchParams);
          console.log("Reponse fetchFile ", response);

          await updateHostRepoToServer();
          setTerminalLineData((prevData) => [
            ...prevData,
            <TerminalOutput>{`$ fetch ${inputTokens[1]}`}</TerminalOutput>,
            <TerminalOutput>
              {"---------------------------------"}
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
            <TerminalOutput>
              <span className="text-[yellow]">{"Fetch file success"} </span>
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
          ]);
        } catch (error) {
          console.log("Error in Fetch feature", error);
          setTerminalLineData((prevData) => [
            ...prevData,
            <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
            <TerminalOutput>
              {"---------------------------------"}
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
            <TerminalOutput>
              <span className="text-[yellow]">{"Error in Fetch feature"} </span>
            </TerminalOutput>,
            <TerminalOutput></TerminalOutput>,
          ]);
        }
      }
    } else if (inputTokens[0] === "myDisk") {
      try {
        const response = await RepositoryApi.getListonDisk();
        const files = response.data.files;
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{"$ myDisk"}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          ...files.map((file, index) => (
            <TerminalOutput key={index}>
              <p className="w-[400px] truncateflex justify-between  text-blue-400">
                {file}
              </p>
            </TerminalOutput>
          )),
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in MyDisk feature", error);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "ping") {
      try {
        const data = { hostname: inputTokens[1] };

        console.log("Ping data", data);

        const response = await ServerServiceApi.ping(data);

        console.log("Ping Response", response.status);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">{"Live"} </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in Ping feature", error);

        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">{"Not Live"} </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "discover") {
      try {
        const data = { hostname: inputTokens[1] };
        console.log("Discover Data", data);
        const response = await ServerServiceApi.discover(data);
        console.log("Discover Response", response);

        const files = response.data.currentFiles;

        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          ...files.map((file, index) => (
            <TerminalOutput key={index}>
              <span className="w-[500px] flex justify-between">
                <span className="w-[80%] truncate text-blue-500">
                  {file?.name || "Null"}
                </span>
                <span className="text-blue-500"> {file?.size || "Null"} </span>
              </span>
            </TerminalOutput>
          )),
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in Discover feature", error);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
          <TerminalOutput>
            <span className="text-[yellow]">{"Hostname not found!"} </span>
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "getHostname") {
      try {
        const response = await ServerServiceApi.getHostname();
        console.log("Gethostname response", response);
        const hostnames = response.data.hostname;
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          ...hostnames.map((hostname, index) => (
            <TerminalOutput key={index}>
              <p className="w-[600px] truncate flex justify-between">
                <span className="text-blue-400 w-[400px] truncate">
                  {hostname}
                </span>
              </p>
            </TerminalOutput>
          )),
          <TerminalOutput></TerminalOutput>,
        ]);
      } catch (error) {
        console.log("Error in GetHostname feature", error);
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput>{`$ ${terminalInput}`}</TerminalOutput>,
          <TerminalOutput>
            {"---------------------------------"}
          </TerminalOutput>,
          <TerminalOutput></TerminalOutput>,
        ]);
      }
    } else if (inputTokens[0] === "clear") {
      setTerminalLineData([
        <TerminalOutput>
          {"Welcome to the File Sharing Application!"}
        </TerminalOutput>,
      ]);
    } else {
      setTerminalLineData((prevData) => [
        ...prevData,
        <TerminalOutput>{terminalInput}</TerminalOutput>,
      ]);
    }
  };

  return (
    <div className="container h-full rounded-lg overflow-hidden">
      <Terminal
        name={"TERMINAL"}
        colorMode={ColorMode.Dark}
        onInput={handleInput}
        height="680px"
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
};

export default TerminalController;
