import React from "react";

const ItemList = ({ infomation }) => {
  return (
    <div className="w-[90%] p-2 pr-4 bg-[#D9D9D9] border-b-4 border-black rounded-md mx-auto text-[24px] my-2 font-semibold text flex justify-between items-center hover:bg-gray-400 transition-all">
      <span> {infomation} </span>
    </div>
  );
};

export default ItemList;
