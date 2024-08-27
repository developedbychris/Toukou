import React, { useState, useEffect } from 'react';
import { handleModalDescription, createSanitizedHtml } from "../helpers";
import useMediaQuery from "../hooks/useMediaQuery";

const modalCSS = "w-full h-full top-0 left-0 fixed"


const Modal = ({ modalAnime, closeModal }) => {
  const isMobile = useMediaQuery('(max-width: 640px)')

  useEffect(()=>{
    document.body.classList.add('no-scroll')
    return () => {
        document.body.classList.remove('no-scroll')
    }
  },[])

  if (!modalAnime) return null;

  return (
    <div className={`${modalCSS} overflow-x-hidden`}>
      {/* OVERLAY */}
      <div className={`${modalCSS} bg-[rgba(49,49,49,0.8)] overflow-hidden`} onClick={isMobile ? closeModal : null}/>

      <div className="modal-content px-10 py-5  w-11/12 md:w-11/12 lg:w-10/12 xl:w-6/12 rounded-xl mx-auto mt-10">
        <div className="flex justify-end">
          <button onClick={closeModal} className="font-Title text-2xl text-gray-500 hover:text-[#02a9ff] duration-300">X</button>
        </div>
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start">
          {/* IMAGE DIV */}
          <div className="h-full max-h-96 mr-2 p-0 flex flex-col items-center mb-3 md:mb-0 ">
            <img className="rounded-lg" src={modalAnime.media.coverImage.large} alt={modalAnime.media.title.romaji} />
            
            <a className="mt-2" href={modalAnime.media.siteUrl} target="_blank">
              <img className="h-7 hover:scale-125 duration-200" src="https://anilist.co/img/icons/icon.svg" alt="AniList Logo" />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center md:justify-start md:items-start w-full px-2">
            {/* Titles*/}
            <h1 className="font-Mono text-2xl">{modalAnime?.media?.title?.english ? modalAnime?.media?.title?.english : modalAnime?.media?.title?.romaji}</h1>
            <h5 className="text-[0.6rem] mb-4">{modalAnime?.media?.title?.native}</h5>
            
            <main className={` text-[${modalAnime.media.coverImage.color}] font-Roboto font-light`}>{createSanitizedHtml(handleModalDescription(modalAnime.media.description))}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
