import React from 'react'
import { useState } from "react"
import { getStatusLabel, handleTitles} from "../helpers"
import Modal from "./Modal"
import { borderStyles } from "../App"

const AnimeEntries = ({animeRes, blurAdult, token, fetchUpdates}) => {
    const [isModalOpen, setModal] = useState(false)
    const [modalMedia, setModalMedia] = useState(null)
    const handleModal = (anime) =>{
        setModalMedia(anime)
        setModal(true)
    }

    return (
        <>
            {
            animeRes.map((list, i)=>(
            <React.Fragment key={list.name}>
            <div  className="-z-50 w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none relative myBorder">
                <h1 className="text-4xl">ANIME</h1>
                <h1 className="text-center text-lg font-semibold text-[#b7e7ff]">
                {list?.isCustomList ? list?.name : (
                    getStatusLabel(list?.status, "anime") === "REPEATING" ? (
                    <>
                        {getStatusLabel(list.status, "anime")}
                        <img src={repeatIcon} alt="repeating icon" className="h-40 ml-2"/>
                        
                    </>
                    ) : getStatusLabel(list.status, "anime")
                    )}
                </h1>
            </div>
            
            {/* GRID */}
            <div className={`grid gap-4 w-10/12 mx-auto mb-20 ${list.entries.length === 1 ? "grid-cols-1 lg:grid-cols-3 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}`}>
            {list.entries.map((anime, i) => (
                <div onClick={()=> handleModal(anime)} key={anime.id} className={`hover:cursor-pointer ${borderStyles} flex flex-col justify-center items-center hover:bg-blue-950 duration-200`}>

                <h1 className="text-center font-Mono text-sm mb-1">{anime.media.title.english ? handleTitles(anime.media.title.english) : handleTitles(anime.media.title.romaji)}</h1>
                
                <img  className={`h-48 shadow-md shadow-[#02a9ff] mb-4 ${anime.media.isAdult ? handleBlur(anime.media.isAdult, blurAdult) : ""}  rounded-md`} src={anime.media.coverImage.large} alt={anime?.media?.title.english} />
                
                <h1 className="text-center mb-2 font-Mono text-sm">{anime.progress} / {anime.media.episodes}</h1>

                </div>
            ))}
            </div>
            </React.Fragment>
            ))
            }
            {isModalOpen && <Modal modalMedia={modalMedia} closeModal={()=> setModal(false)} token={token} fetchUpdates={fetchUpdates}/>}
        </>
    )
}

export default AnimeEntries