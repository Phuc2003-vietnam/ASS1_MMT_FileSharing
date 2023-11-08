import React from "react";

const ItemList = ({ fileName, fileSize }) => {
  return (
    <div className="w-[90%] p-2 pr-4 bg-[#D9D9D9] border-b-4 border-black rounded-md mx-auto text-[20px] my-2 font-semibold text flex justify-between items-center hover:bg-gray-400 transition-all">
      <span className="w-[500px] flex justify-between">
        <span className="w-[80%] truncate text-blue-500">
          {fileName || "Null"}
        </span>
        {fileSize && <span> {fileSize || "Null"} </span>}
      </span>
    </div>
  );
};

export default ItemList;
