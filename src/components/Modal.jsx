import React, { useState, useEffect } from 'react';
import { handleModalDescription, createSanitizedHtml, getFormatLabel } from "../helpers";
import useMediaQuery from "../hooks/useMediaQuery";
import Accordion from "./Accordion/Accordion";
const modalCSS = "w-full h-full top-0 left-0 fixed"


const Modal = ({ modalMedia, closeModal }) => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [hovered, setHovered] = useState(false)
  useEffect(()=>{
    document.body.classList.add('no-scroll')
    return () => {
        document.body.classList.remove('no-scroll')
    }
  },[])

  if (!modalMedia) return null;

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
          <div className="max-h-96 mr-2 p-0 flex flex-col items-center mb-3 md:mb-0 ">
            <img className="w-40 md:w-auto rounded-lg" src={modalMedia.media.coverImage.large} alt={modalMedia.media.title.romaji} />
            
            <a className="mt-2" href={modalMedia.media.siteUrl} target="_blank">
              <img className="h-7 hover:scale-125 duration-200" src="https://anilist.co/img/icons/icon.svg" alt="AniList Logo" />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center md:justify-start md:items-start w-full px-2">
            {/* Titles*/}
            <h1 className="font-Mono text-2xl text-neutral-200 text-center mb-1">{modalMedia?.media?.title?.english ? modalMedia?.media?.title?.english : modalMedia?.media?.title?.romaji}</h1>
            <h5 className="font-Japanese text-sm font-light mb-4 tracking-wide text-center" style={{color: modalMedia.media.coverImage.color}}>{modalMedia?.media?.title?.native}</h5>
            {/* PROGRESS COUNT */}
            <div className="flex items-center">
              <h4 className="font-Mono mr-2" >{getFormatLabel(modalMedia.media.format)} Count:</h4>
              <input type="number" value={modalMedia.progress}  className="text-neutral-200 w-12 text-center outline-none bg-AniListDarkBlue rounded-md mr-1" style={{caretColor: modalMedia.media.coverImage.color}}/>
              <button 
                className="font-Mono bg-AniListDarkBlue px-2 rounded-md duration-200" 
                onMouseEnter={()=> setHovered(true)} 
                onMouseLeave={()=> setHovered(false)}
                style={{backgroundColor: hovered ? modalMedia.media.coverImage.color : "initial"}}>
                +
              </button>
            </div>
            <Accordion modalMediaColor={modalMedia.media.coverImage.color} title="Synopsis" content={createSanitizedHtml(handleModalDescription(modalMedia.media.description))}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
