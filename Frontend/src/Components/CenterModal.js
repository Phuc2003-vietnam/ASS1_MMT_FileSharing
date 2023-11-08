import React from "react";
import ReactDom from "react-dom";

const CenterModal = ({ open = false, handleClose = () => {}, children }) => {
  if (document.querySelector("body") === "undefined") {
    handleClose();
    return <div className="ModalHidden"></div>;
  }

  return ReactDom.createPortal(
    <div
      className={`${
        open ? "" : "opacity-0 invisible"
      } Modal fixed inset-0 z-50 flex items-center justify-center p-2 transition-all w-full`}
    >
      <div
        className="overlay absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      ></div>
      <div className="content relative w-[auto] h-[auto] z-10 bg-white rounded-lg overflow-hidden">
        <span
          className="absolute right-2 top-2 p-2 flex items-center justify-center rounded-full z-10"
          onClick={handleClose}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="white"
            />
          </svg>
        </span>
        {children}
      </div>
    </div>,
    document.querySelector("body")
  );
};

export default CenterModal;
