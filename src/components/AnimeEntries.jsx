import React from 'react'
import { useState } from "react"
import { getStatusLabel, handleTitles} from "../helpers"
import Modal from "./Modal"
import { borderStyles } from "../App"
import useMediaQuery from "../hooks/useMediaQuery"

const AnimeEntries = ({animeRes, blurAdult, token, fetchUpdates}) => {
    const [isModalOpen, setModal] = useState(false)
    const [modalMedia, setModalMedia] = useState(null)
    const isMobile = useMediaQuery('(max-width: 767px)')
    const handleModal = (anime) =>{
        setModalMedia(anime)
        setModal(true)
    }
    const handleBlur = (isAdult) =>{
        if(isAdult && blurAdult){
          return "blur-sm"
        } else{
          return ""
        }
      }

    return (
        <>
            {
            animeRes.map((list)=>(
            <React.Fragment key={list.name}>
            <div  className="mt-7 -z-50 w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none relative myBorder">
                <h1 className="text-center text-lg font-semibold text-[#b7e7ff]">
                {list?.isCustomList ? list?.name : (
                    getStatusLabel(list?.status, "anime") === "REPEATING" ? (
                    <>
                        {getStatusLabel(list.status, "anime")}
                    </>
                    ) : getStatusLabel(list.status, "anime")
                    )}
                </h1>
            </div>
            
            {/* GRID & FLEX COL */}
            {isMobile ? 
            
            <div className="w-10/12 mx-auto mb-20 flex flex-col justify-center">
             {list.entries.map((anime) => (
                <div className={`flex mb-3 border-t-AniListBlue border-r-[#174c66] border-4 p-3 hover:bg-blue-950 duration-200 hover:cursor-pointer`} onClick={()=> handleModal(anime)} key={anime.id}>
                    <img className={`h-24 mr-4 shadow-md ${anime.media.isAdult ? handleBlur(anime.media.isAdult, blurAdult) : ""}  rounded-md`} src={anime.media.coverImage.large} alt={anime?.media?.title.english} style={{ boxShadow: `0 4px 6px -1px ${anime.media.coverImage.color}` }}/>
                    <div className="flex flex-col mx-auto justify-around">
                        <h1 className="text-start font-Mono text-sm mb-1">{anime.media.title.english ? handleTitles(anime.media.title.english) : handleTitles(anime.media.title.romaji)}</h1>
                        <h1 className="text-center font-Mono font-black text-sm text-neutral-300">{anime.progress} / {anime.media.episodes}</h1>
                    </div>
                </div>
             ))}
            </div>

            :

            <div className={`grid gap-4 w-10/12 mx-auto mb-20 ${list.entries.length === 1 ? "grid-cols-1 lg:grid-cols-3 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}`}>
            {list.entries.map((anime) => (
                <div onClick={()=> handleModal(anime)} key={anime.id} className={`hover:cursor-pointer ${borderStyles} flex flex-col justify-center items-center hover:bg-blue-950 duration-200`}>

                <h1 className="text-center font-Mono text-sm mb-1">{anime.media.title.english ? handleTitles(anime.media.title.english) : handleTitles(anime.media.title.romaji)}</h1>
                
                <img  className={`h-48 shadow-md mb-4 ${anime.media.isAdult ? handleBlur(anime.media.isAdult, blurAdult) : ""}  rounded-md`} src={anime.media.coverImage.large} alt={anime?.media?.title.english} style={{ boxShadow: `0 4px 6px -1px ${anime.media.coverImage.color}` }} />
                
                <h1 className="text-center mb-2 font-Mono text-sm font-black text-neutral-300">{anime.progress} / {anime.media.episodes}</h1>

                </div>
            ))}
            </div>
            }
            </React.Fragment>
            ))
            }
            {isModalOpen && <Modal modalMedia={modalMedia} closeModal={()=> setModal(false)} token={token} fetchUpdates={fetchUpdates}/>}
        </>
    )
}

export default AnimeEntries