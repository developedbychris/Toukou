import React, { useState, useEffect } from 'react';

const modalCSS = "w-full h-full top-0 left-0 fixed";

const Modal = ({ modalAnime, closeModal }) => {

    useEffect(()=>{
        document.body.classList.add('no-scroll')
        return () => {
            document.body.classList.remove('no-scroll')
        }
    },[])



    if (!modalAnime) return null; // if modalState is false, return null (don't render anything)

  return (
    <div className={`${modalCSS} overflow-hidden`}>
      <div className={`${modalCSS} bg-[rgba(49,49,49,0.8)] overflow-hidden`} />
      <div className="modal-content px-10 py-5 w-6/12 rounded-lg bg-white mx-auto mt-10">
        <div className="flex justify-end">
          <button onClick={closeModal} className="font-Title text-2xl text-gray-500 hover:text-[#02a9ff] duration-300">X</button>
        </div>
        <h1 className="mx-auto text-start">{modalAnime?.media?.title?.english}</h1>
      </div>
    </div>
  );
};

export default Modal;
