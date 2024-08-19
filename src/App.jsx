import React from "react"
import { useEffect, useState } from 'react'
import { initQuery, mangaQuery, animeQuery } from "./queries"
import {handleTitles, handleBlur, getStatusLabel, getMediaStatuslabel} from "./helpers"
import Modal from "./components/Modal"
import loadingIcon from "./assets/loading.svg"
import repeatIcon from "./assets/repeat.svg"
const url = 'https://graphql.anilist.co'
const borderStyles = "p-5 border-t-[#02a9ff] border-r-[#174c66] border-4 rounded-md h-[19rem]"
// fuwn id: 5678223
//igor id: 243474
//opi id: 5715171
function App() {
  const [animeRes, setAnimeRes] = useState(null)
  const [mangaRes, setMangaRes] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("access_token"))
  const [userID, setUserID] = useState(5678223)
  const [blurAdult, setBlurAdult] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalAnime, setModalAnime] = useState(null)
  const handleModal = (anime) =>{
    setModalAnime(anime)
    setModal(true)
}

  //*TOKEN USEEFFECT
  useEffect(()=>{
    if(!token){
      const hash = window.location.hash.substring(1) // Removes the '#' from the beginning
      const params = new URLSearchParams(hash)
      const newToken = params.get('access_token')
      
      if(newToken){
        setToken(newToken)
        localStorage.setItem("access_token", newToken)
        window.history.replaceState(null, null, window.location.pathname)
      }
    }
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: initQuery,
        variables: {}
      })
    }
    // Runs when token is registered
    if (token) {
      setLoading(true)
      fetch(url, options)
        .then(data => data.json())
        .then(data =>{
          setUserID(data.data.Viewer.id)
          setUserData(data.data.Viewer)
        })
        .catch(e => setError(e.message))
        .finally(()=> setLoading(false))
    }
  }, [token])

  // //* ANILIST USERID USEEFFECT
  useEffect(()=>{
    if(userID){
      const animeOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: animeQuery,
          variables: {userId: userID}
        })
      }
      const mangaOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: mangaQuery,
          variables: {userId: userID}
        })
      }

      setLoading(true)
      fetch(url, animeOptions)
        .then(data => data.json())
        .then(data => {
          setAnimeRes(data.data.MediaListCollection.lists)
          console.log(data.data.MediaListCollection.lists);
        })
        .catch(e => {
          setError(e.message)
          console.error(e.message)
        })
        .finally(() => setLoading(false))

      fetch(url, mangaOptions)
        .then(data => data.json())
        .then(data =>{
          setMangaRes(data.data.MediaListCollection.lists)
          console.log(data.data.MediaListCollection.lists)
        })
        .catch(e => {
          setError(e.message)
          console.error(e.message)
        })
        .finally(() => setLoading(false))
    }
  },[userID])

  return (
    <div className="mx-auto flex flex-col">
      
      <header className="py-6 flex flex-col justify-center items-center overflow-x-visible bg-[#152232]">
        <h1 className="text-5xl tracking-wide font-Title mb-1 text-neutral-200 select-none">TOU<span className="text-[#02a9ff]">KOU</span></h1>
        <h3 className="text-xl tracking-widest font-Japanese font-black">投<span className="text-[#02a9ff]">稿</span></h3>
        <h5></h5>
      </header>
      
      
      {!token && 
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-2xl mb-4 font-Mono select-none">Connect Your AniList Account</h1>
        <a href='https://anilist.co/api/v2/oauth/authorize?client_id=20510&response_type=token'>
          <button className="bg-[#02a9ff] px-4 py-2 rounded-lg font-Mono text-2xl ">Login With AniList</button>
        </a>
      </div>
      }
      
      {/* USER INFO / WELCOME SECTION */}
      {loading ? (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <img src={loadingIcon} className="w-36 mx-auto"/>
        </div>
      ) : userData && (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <h1 className="font-Mono font-bold text-2xl mb-5">Welcome {userData.name}!</h1>
          <div className="flex w-auto">
            <img className="h-16 md:h-20 lg:h-36 w-auto" src={userData.avatar.large} alt={`${userData}'s avatar`} />
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-2">Episodes Watched: {userData.statistics.anime.episodesWatched}</h1>
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-2">Chapters Read: {userData.statistics.manga.chaptersRead}</h1>
              <div className="flex items-center p-0 m-0 ">
                <h6 className="font-Mono text-xs md:text-lg mr-1">Blur 18+ Covers</h6>
                <input className="h-2 md:h-3 outline-none" disabled={!animeRes && !mangaRes} type="checkbox" onChange={()=> setBlurAdult(!blurAdult) }/>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ERROR MESSAGE */}
      {error && <h2 className="text-red-700 text-2xl text-center my-10">{error}</h2>}

      {/* ANIME ENTRIES */}
      {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : animeRes?.length > 0 ? (
        <>
        {
        
        animeRes.map((list, i)=>(
        <React.Fragment key={list.name}>
          <div  className="w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none relative myBorder">
            <h1 className="text-4xl">ANIME</h1>
            <h1 className="text-center text-lg font-semibold text-[#b7e7ff] underline underline-offset-3">
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
        
        </>
      ) : null}
      
       {/* Manga ENTRIES */}
       {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : mangaRes?.length > 0 ? (
        <>
        {
        
        mangaRes.map((list, i)=>(
        <React.Fragment key={list.name}>
          <div  className="w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none relative myBorder">
            <h1 className="text-4xl">MANGA</h1>
            <h1 className="text-lg text-[#b7e7ff] underline underline-offset-3">{list.isCustomList ? list.name : getStatusLabel(list.status, "manga")}</h1>
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
        
        </>
      ) : null}
      
      {modal && <Modal modalAnime={modalAnime} closeModal={()=> setModal(false)}/>}
    </div>
  )
}

export default App
