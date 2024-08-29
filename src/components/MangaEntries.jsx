import React from 'react'
import { useState } from "react"
import { getStatusLabel, handleTitles, getMediaStatuslabel} from "../helpers"
import Modal from "./Modal"
import { borderStyles } from "../App"

const MangaEntries = ({mangaRes, blurAdult, token, fetchUpdates}) => {
    const [isModalOpen, setModal] = useState(false)
    const [modalMedia, setModalMedia] = useState(null)
    const handleModal = (anime) =>{
        setModalMedia(anime)
        setModal(true)
    }
    
    return (
        <>
            {
            mangaRes.map((list, i)=>(
            <React.Fragment key={list.name}>
            <div  className="-z-50 w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none relative myBorder">
                <h1 className="text-4xl">MANGA</h1>
                <h1 className="text-lg text-[#b7e7ff]">{list.isCustomList ? list.name : getStatusLabel(list.status, "manga")}</h1>
            </div>
            
            {/* GRID */}
            <div className={`grid gap-4 w-10/12 mx-auto mb-20 ${list.entries.length === 1 ? "grid-cols-1 lg:grid-cols-3 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}`}>
            {list.entries.map((manga, i) => (
                <div onClick={()=> handleModal(manga)}  key={manga.id} className={`hover:cursor-pointer ${borderStyles} flex flex-col justify-center items-center hover:bg-blue-950 duration-200`}>
                    <h1 className=" text-center font-Mono text-sm mb-1">{manga.media.title.english ? handleTitles(manga.media.title.english) : handleTitles(manga.media.title.romaji)}</h1>
                    <img className={`h-48 shadow-md shadow-[#02a9ff] mb-4 ${manga.media.isAdult ? handleBlur(manga.media.isAdult, blurAdult) : ""} rounded-md`} src={manga.media.coverImage.large} alt={manga?.media?.title.english} />
                    <h1 className="text-center mb-2 font-Mono text-sm">{manga.progress} / {manga.media.chapters ? manga.media.chapters : getMediaStatuslabel(manga.media.status)}</h1>
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

export default MangaEntries