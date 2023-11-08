import BaseServerApi from "./BaseServerApi";

const ServerServiceApi = {
  getListFile() {
    const path = "/api/all-current-files";
    return BaseServerApi.get(path);
  },

  searchFile(data) {
    const path = "/api/search";
    return BaseServerApi.post(path, data);
  },

  uploadFileInfo(FileInfo) {
    const path = "/api/list-file-of-a-host";
    // console.log(JSON.stringify(FileInfo));
    return BaseServerApi.put(path, JSON.stringify(FileInfo));
  },

  register(data) {
    const path = "/api/register";
    // console.log(JSON.stringify(data));
    return BaseServerApi.post(path, JSON.stringify(data));
  },

  login(data) {
    const path = "/api/login";
    // console.log(JSON.stringify(data));
    return BaseServerApi.post(path, JSON.stringify(data));
  },

  logout(data) {
    const path = "/api/logout";
    // console.log(JSON.stringify(data));
    return BaseServerApi.post(path, JSON.stringify(data));
  },

  ping(data) {
    const path = `/api/ping`;
    // "http://172.16.1.156:5000/api/admin",
    return BaseServerApi.post(path, data);
  },

  discover(data) {
    const path = `/api/current-files`;

    return BaseServerApi.post(path, data);
  },

  getHostname(data) {
    const path = `/api/hostname`;

    return BaseServerApi.get(path, data);
  },
};

export default ServerServiceApi;
