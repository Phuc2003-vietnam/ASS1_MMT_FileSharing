import BaseP2pApi from "./BaseP2pApi";

const RepositoryApi = {
  getList() {
    const path = "/hostRepo";

    return BaseP2pApi.get(path);
  },

  getListonDisk() {
    const path = "/hostDisk";

    return BaseP2pApi.get(path);
  },

  addFile(data) {
    const path = "/uploadRepo";

    return BaseP2pApi.post(path, data);
  },

  publishFile(data) {
    const path = "/publishDiskToRepo";
    console.log(data);
    return BaseP2pApi.post(path, JSON.stringify(data));
  },

  fetchFile(FileInfo) {
    const path = `/fetch`;
    // console.log(FileInfo);
    return BaseP2pApi.post(path, FileInfo);
  },

  deleteFile(data) {
    const path = `/fileInRepo`;

    return BaseP2pApi.post(path, data);
  },
};

export default RepositoryApi;
