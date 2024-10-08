import { useState, useEffect } from 'react';
import { createSanitizedHtml, getFormatLabel, getModalStatusLabel, months, getOrdinal, getRatingColor } from "../helpers";
import { mediaProgressMutation } from "../queries";
import useMediaQuery from "../hooks/useMediaQuery";
import Accordion from "./Accordion/Accordion";
import { RiCloseCircleFill } from "react-icons/ri";
import { url } from "../App";
const modalCSS = "w-full h-full top-0 left-0 fixed"

const Modal = ({ modalMedia, closeModal, token, fetchUpdates }) => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const isTablet = useMediaQuery('(max-width: 1023px)')
  const isTabletAndMobile = useMediaQuery('(max-width: 767px)')
  const [hovered, setHovered] = useState(false)
  const [hovered2, setHovered2] = useState(false)
  const originalProgress = modalMedia.progress
  const [newProgress, setNewProgress] = useState(modalMedia.progress)
  const [activity, setActivity] = useState(null)
  
  const handleIncrement = () => {
    setNewProgress(prev => {
      const updatedProgress = (prev === modalMedia.media.episodes || prev === modalMedia.media.chapters) ? prev : prev + 1
      getActivity(updatedProgress)
      return updatedProgress
    })
  }

  const handleDecrement = () => {
    setNewProgress(prev => {
      const updatedProgress = (prev === 1) || (prev === 0) ? prev : prev - 1
      getActivity(updatedProgress)
      return updatedProgress
    })
  }

  const handleInputChange = (e) => {
    const val = e.target.value;

    // removes non digit chars
    const numericVal = val.replace(/[^0-9]/g, '')
    setNewProgress(parseInt(numericVal))
    getActivity(parseInt(numericVal))
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
      if (response.ok && data) {
        fetchUpdates()
      } else {
        console.error('Mutation failed', data);
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  }

  function getActivity(updatedProgress) {
    const formatLabel = getFormatLabel(modalMedia.media.format);
    const maxProgress = formatLabel === "Episode" ? modalMedia.media.episodes : modalMedia.media.chapters;
    const title = modalMedia?.media?.title?.english || modalMedia?.media?.title?.romaji;
    const mediaUrl = modalMedia.media.siteUrl;
    const userStatus = getModalStatusLabel(modalMedia.status, modalMedia.media.format)
    let action
    // FOR COMPLETION CONDITIONAL
    switch (userStatus) {
      case "re-watched":
        action = "re-watching"
        break
      case "re-read":
        action = "re-reading"
        break
      case "watched":
        action = "watching"
        break
      case "read":
        action = "reading"
        break
      default:
        action = "watching" 
    }
    if (updatedProgress === maxProgress) {
      // completed reading/watching
      setActivity(`I finished ${action} ${title}\n\n[via @ToukouApp]\n${mediaUrl}`)
    } else if (updatedProgress > originalProgress) {
      // if updating progress to a higher value, show range only if increment is greater than 1
      if (originalProgress < updatedProgress - 1) {
        setActivity(`I ${userStatus} ${formatLabel.toLowerCase()}s ${originalProgress + 1} - ${updatedProgress} of ${title}\n\n[via @ToukouApp]\n${mediaUrl}`)
      } else {
        // otherwise, show a single progress entry
        setActivity(`I ${userStatus} ${formatLabel.toLowerCase()} ${updatedProgress} of ${title}\n\n[via @ToukouApp]\n${mediaUrl}`)
      }
    } else if (updatedProgress < originalProgress){
      // For reverse entries
      setActivity(`I ${userStatus} ${formatLabel.toLowerCase()} ${updatedProgress} of ${title}\n\n[via @ToukouApp]\n${mediaUrl}`)
    }
  }

  const progressChanged = newProgress !== originalProgress
  const handleUpdateAndPost = () =>{
    handleMediaUpdate()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(activity)}`)
  }
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
      {/* MODAL CONTENT */}
      <div className="modal-content max-h-[75vh] md:max-h-[55vh] 2xl:max-h-[40vh] px-10 py-5  w-11/12 md:w-11/12 lg:w-10/12 xl:w-6/12 rounded-xl mx-auto mt-10 border-b-2 border-l-2" style={{borderColor: modalMedia.media.coverImage.color, scrollbarColor: `${modalMedia.media.coverImage.color} #1a2b4a`}}>
        <div className="flex justify-end">
          <RiCloseCircleFill className={`close-btn scale-150 duration-200 hover:cursor-pointer`} style={{'--default-color': modalMedia.media.coverImage.color}} onClick={closeModal}/>
        </div>
        <div className="flex flex-col md:flex-row justify-start items-center md:items-start rounded-lg" >
          {/* IMAGE DIV */}
          <div className="max-h-96 mr-2 p-0 flex flex-col items-center mb-3 md:mb-0 rounded-lg">
            <img className="w-40 md:w-auto rounded-lg" src={modalMedia.media.coverImage.large} alt={modalMedia.media.title.romaji} />
            
            <a className="mt-2" href={modalMedia.media.siteUrl} target="_blank">
              <img className="h-7 hover:scale-125 duration-200 AL" src="https://anilist.co/img/icons/icon.svg" alt="AniList Logo" />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center md:justify-start md:items-start w-full px-2 ">
            {/* Titles*/}
            <h1 className="font-Mono text-2xl text-white text-center mb-1 font-semibold">{modalMedia?.media?.title?.english || modalMedia?.media?.title?.romaji}</h1>
            <h5 className="font-Japanese text-sm font-light mb-4 tracking-wide text-center italic" style={{color: modalMedia.media.coverImage.color}}>{modalMedia?.media?.title?.native}</h5>
            <div className={`${isTabletAndMobile ? "bg-[#101b27] p-3 rounded-lg" :""} mb-4`}>
              <h5 className="font-Mono text-sm font-semibold mb-2 text-start tracking-tighter text-neutral-300">
                Released: {months[modalMedia?.media?.startDate.month - 1]} {getOrdinal(modalMedia?.media?.startDate?.day)}, <span style={{color: modalMedia.media.coverImage.color}}>{modalMedia?.media?.startDate.year} </span>
              </h5>
              <h5 className="font-Mono text-sm mb-2 text-start tracking-tighter font-semibold text-neutral-300">
              Genres: <span style={{color: modalMedia.media.coverImage.color}}>{modalMedia?.media?.genres?.join(", ")}</span>
              </h5>
              <h5 className="font-Mono text-sm text-start font-semibold text-neutral-300">
                Avg. AL User Score: <span style={{color: getRatingColor(modalMedia?.media?.averageScore)}}>{modalMedia?.media?.averageScore} %</span>
              </h5>
            </div>
            {/* PROGRESS COUNT */}
            <div className="flex items-center">
              <h4 className="font-Mono mr-2 text-lg lg:text-base" >{getFormatLabel(modalMedia.media.format)} Count:</h4>
              <input type="number"  onBlur={handleBlur} value={parseInt(newProgress)} onChange={handleInputChange}  className="text-lg lg:text-base  text-neutral-200 w-12 text-center outline-none bg-AniListDarkBlue rounded-md mr-1" style={{caretColor: modalMedia.media.coverImage.color}}/>
              
              { /* INC/DEC BUTTONS */
                !isTabletAndMobile && (
                <div className="font-black font-Japanese">
                  <button 
                  className="bg-AniListDarkBlue py-1 lg:py-0 px-4 lg:px-3 rounded-md duration-200 mr-1" 
                  onMouseEnter={()=> setHovered2(true)} 
                  onMouseLeave={()=> setHovered2(false)}
                  onClick={handleDecrement}
                  style={{backgroundColor: hovered2 || isTablet ? modalMedia.media.coverImage.color : "initial"}}>
                    -
                  </button>
                  <button 
                  className="bg-AniListDarkBlue py-1 lg:py-0 px-4 lg:px-3 rounded-md duration-200" 
                  onMouseEnter={()=> setHovered(true)} 
                  onMouseLeave={()=> setHovered(false)}
                  onClick={handleIncrement}
                  style={{backgroundColor: hovered || isTablet ? modalMedia.media.coverImage.color : "initial"}}>
                    +
                  </button>
                </div>
                )
              }
            </div>

              { /* INC/DEC BUTTONS */
              isTabletAndMobile &&(
              <div className="my-4 font-black flex items-center justify-center w-6/12">
                <button 
                className="w-full bg-AniListDarkBlue py-1 lg:py-0 px-4 lg:px-2 rounded-md duration-200 mr-1" 
                onMouseEnter={()=> setHovered2(true)} 
                onMouseLeave={()=> setHovered2(false)}
                onClick={handleDecrement}
                style={{backgroundColor: hovered2 ? "#0c1522" : modalMedia.media.coverImage.color}}>
                  -
                </button>
                <button 
                className="w-full bg-AniListDarkBlue py-1 lg:py-0 px-4 lg:px-2 rounded-md duration-200 hover:bg-AniListDarkBlue" 
                onMouseEnter={()=> setHovered(true)} 
                onMouseLeave={()=> setHovered(false)}
                onClick={handleIncrement}
                style={{backgroundColor: hovered ? "#0c1522" : modalMedia.media.coverImage.color}}>
                  +
                </button>
              </div>
              )
            }

            { /* COMMIT PROGRESS BUTTONS */
              progressChanged && (
                <div className="mt-4 flex flex-col md:flex-row justify-center">
                  <a onClick={handleUpdateAndPost}>
                    <button 
                      className="bg-green-600 hover:bg-green-700 mb-2 md:mb-0 text-white px-3 py-2 rounded-md duration-300 mr-2"
                    >
                      Update and Post
                    </button>
                  </a>
                  <button 
                    className="bg-AniListDarkBlue hover:bg-AniListBlue text-white px-3 py-2 rounded-md duration-300 mr-2"
                    onClick={handleMediaUpdate}
                  >
                    Update
                  </button>
                </div>
              )
            }
            <Accordion modalMediaColor={modalMedia.media.coverImage.color} title="Synopsis" content={createSanitizedHtml(modalMedia.media.description)} modal={true}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
