import React, { useState, useEffect } from 'react';
import { createSanitizedHtml, getFormatLabel } from "../helpers";
import { mediaProgressMutation } from "../queries";
import useMediaQuery from "../hooks/useMediaQuery";
import Accordion from "./Accordion/Accordion";
import { RiCloseCircleFill } from "react-icons/ri";
import { url } from "../App";
const modalCSS = "w-full h-full top-0 left-0 fixed"

const Modal = ({ modalMedia, closeModal, token, fetchUpdates }) => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [hovered, setHovered] = useState(false)
  const originalProgress = modalMedia.progress
  const [newProgress, setNewProgress] = useState(modalMedia.progress)
  const [activity, setActivity] = useState(null)
  
  const handleIncrement = () => {
    setNewProgress(prev => {
      const updatedProgress = (prev === modalMedia.media.episodes || prev === modalMedia.media.chapters) ? prev : prev + 1
      getActivity(updatedProgress)
      console.log(activity)
      return updatedProgress
    })
  }

  const handleInputChange = (e) => {
    const val = e.target.value;

    // Remove any non-digit characters except for the empty string
    const numericVal = val.replace(/[^0-9]/g, '');

    

    // Update the state and trigger activity update only if it's a valid numeric input
    
      setNewProgress(numericVal);
      getActivity(numericVal);
    
  }

  const handleBlur = (e) => {
    if (e.target.value === "") {
        setNewProgress(originalProgress)
    }
  }
  const handleMediaUpdate = async () =>{
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: mediaProgressMutation,
        variables: {
          mediaId: modalMedia.media.id,
          progress: newProgress,
          status: newProgress === modalMedia.media.episodes || newProgress === modalMedia.media.chapters ? "COMPLETED" : modalMedia.status
        }
      })
    }
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (response.ok && data) {
        fetchUpdates()
      } else {
        console.error('Mutation failed', data);
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  }
  function getActivity(updatedProgress){
    const formatLabel = getFormatLabel(modalMedia.media.format)
    const watchedOrRead = formatLabel === "Episode" ? "watched" : "read"
    const maxProgress = formatLabel === "Episode" ? modalMedia?.media?.episodes : modalMedia.media.chapters
    const watchable = formatLabel === "Episode"
    const title = modalMedia?.media?.title?.english || modalMedia?.media?.title?.romaji
    const mediaUrl = modalMedia.media.siteUrl
    if (updatedProgress === originalProgress + 1) {
      // Show single progress entry
      setActivity(`I ${watchedOrRead} ${formatLabel.toLowerCase()} ${updatedProgress} of ${title}\nvia @ToukouApp\n${mediaUrl}`);
    } else if (originalProgress === maxProgress) {
      // Finished watching/reading
      setActivity(`I finished ${watchable ? 'watching' : 'reading'} ${title}\nvia @ToukouApp\n${mediaUrl}`);
    } else if (updatedProgress < originalProgress) {
      // For reverse entries
      setActivity(`I ${watchedOrRead} ${formatLabel.toLowerCase()} ${updatedProgress} of ${title}\nvia @ToukouApp\n${mediaUrl}`);
    } else if (updatedProgress > originalProgress) {
      // Show range if increment is greater than 1
      setActivity(`I ${watchedOrRead} ${formatLabel.toLowerCase()} ${originalProgress + 1} - ${updatedProgress} of ${title}\nvia @ToukouApp\n${mediaUrl}`);
    }
  }
  const progressChanged = newProgress !== originalProgress

  useEffect(()=>{
    console.log(modalMedia)
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
      {/* MODAL CONTENT */}
      <div className="modal-content max-h-[75vh] md:max-h-[55vh] 2xl:max-h-[75vh] px-10 py-5  w-11/12 md:w-11/12 lg:w-10/12 xl:w-6/12 rounded-xl mx-auto mt-10 border-b-2 border-l-2" style={{borderColor: modalMedia.media.coverImage.color, scrollbarColor: `${modalMedia.media.coverImage.color} #1a2b4a`}}>
        <div className="flex justify-end">
          <RiCloseCircleFill className={`close-btn scale-150 duration-200 hover:cursor-pointer`} style={{'--default-color': modalMedia.media.coverImage.color}} onClick={closeModal}/>
        </div>
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start rounded-md" >
          {/* IMAGE DIV */}
          <div className="max-h-96 mr-2 p-0 flex flex-col items-center mb-3 md:mb-0 ">
            <img className="w-40 md:w-auto rounded-lg" src={modalMedia.media.coverImage.large} alt={modalMedia.media.title.romaji} />
            
            <a className="mt-2" href={modalMedia.media.siteUrl} target="_blank">
              <img className="h-7 hover:scale-125 duration-200" src="https://anilist.co/img/icons/icon.svg" alt="AniList Logo" />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center md:justify-start md:items-start w-full px-2">
            {/* Titles*/}
            <h1 className="font-Mono text-2xl text-neutral-200 text-center mb-1">{modalMedia?.media?.title?.english || modalMedia?.media?.title?.romaji}</h1>
            <h5 className="font-Japanese text-sm font-light mb-4 tracking-wide text-center" style={{color: modalMedia.media.coverImage.color}}>{modalMedia?.media?.title?.native}</h5>
            {/* PROGRESS COUNT */}
            <div className="flex items-center">
              <h4 className="font-Mono mr-2" >{getFormatLabel(modalMedia.media.format)} Count:</h4>
              <input type="number"  onBlur={handleBlur} value={parseInt(newProgress)} onChange={handleInputChange}  className="text-neutral-200 w-12 text-center outline-none bg-AniListDarkBlue rounded-md mr-1" style={{caretColor: modalMedia.media.coverImage.color}}/>
              <button 
                className="font-Mono bg-AniListDarkBlue px-2 rounded-md duration-200" 
                onMouseEnter={()=> setHovered(true)} 
                onMouseLeave={()=> setHovered(false)}
                onClick={handleIncrement}
                style={{backgroundColor: hovered ? modalMedia.media.coverImage.color : "initial"}}>
                +
              </button>
            </div>
            {
              progressChanged && (
                <div className="mt-4 flex flex-col md:flex-row justify-center font-Japanese">
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(activity)}`} target="_blank" onClick={handleMediaUpdate}>
                    <button 
                      className="bg-green-600 hover:bg-green-700 mb-2 md:mb-0 text-white px-3 py-2 rounded-md duration-300 mr-2"
                    >
                      Commit Changes and Tweet
                    </button>
                  </a>
                  <button 
                    className="bg-AniListDarkBlue hover:bg-AniListBlue text-white px-3 py-2 rounded-md duration-300 mr-2"
                    onClick={handleMediaUpdate}
                  >
                    Commit Changes
                  </button>
                </div>
              )
            }
            <Accordion modalMediaColor={modalMedia.media.coverImage.color} title="Synopsis" content={createSanitizedHtml(modalMedia.media.description)}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
