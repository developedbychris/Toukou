import React from "react"
import { useEffect, useState } from 'react'
import { initQuery, mangaQuery, animeQuery } from "./queries"
import Header from "./components/Header"
import Modal from "./components/Modal"
import loadingIcon from "./assets/loading.svg"
import AnimeEntries from "./components/AnimeEntries"
import MangaEntries from "./components/MangaEntries"
import chika from "./assets/chika.gif"
const url = 'https://graphql.anilist.co'
export const borderStyles = "p-5 border-t-[#02a9ff] border-r-[#174c66] border-4 rounded-md h-[19rem]"
// fuwn id: 5678223
//igor id: 243474
//opi id: 5715171
// jasper id: 6890331
// cloud id: 436069
// dude who only reads manga: 6185934
function App() {
  const [animeRes, setAnimeRes] = useState(null)
  const [mangaRes, setMangaRes] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false) 
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("access_token"))
  const [userID, setUserID] = useState(null)
  const [blurAdult, setBlurAdult] = useState(false)

  const logOut = () =>{
    localStorage.removeItem('access_token')
    setToken(null)
    setUserData(null)
    setUserID(null)
    setAnimeRes(null)
    setMangaRes(null)
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
          setAnimeRes(data?.data?.MediaListCollection?.lists)
          console.log(data?.data?.MediaListCollection?.lists);
        })
        .catch(e => {
          setError(e.message)
          console.error(e.message)
        })
        .finally(() => setLoading(false))

      fetch(url, mangaOptions)
        .then(data => data.json())
        .then(data =>{
          setMangaRes(data?.data?.MediaListCollection?.lists)
          console.log(data?.data?.MediaListCollection?.lists)
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
      
      <Header/>
      
      {!token && 
        <div className="mt-10 w-10/12 md:w-9/12 xl:w-5/12 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-center text-4xl md:text-6xl mb-2 font-Roboto font-black select-none text-neutral-200">Welcome to Toukou!</h1>
          <img className="rounded-lg w-40 mb-4" src={chika} alt="gif of mayuri from steins;gate" />
          <p className="leading-relaxed text-lg md:text-3xl mb-12 font-Roboto tracking-wide text-center text-neutral-200 select-none">
            Connect your AniList account to Toukou, where you can easily track and update the anime and manga you're currently watching, reading, re-watching, or re-reading.
            <br/><br/> Plus, share your latest updates directly to Twitter/X to let your friends know what you're up to!
          </p>
          <a href='https://anilist.co/api/v2/oauth/authorize?client_id=20510&response_type=token'>
            <button className="bg-[#02a9ff] px-6 py-3 rounded-lg font-Mono text-lg md:text-2xl text-neutral-200 hover:bg-[#0288d1] duration-300">
              Login With AniList
            </button>
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
          <h1 className="font-Mono font-bold text-2xl mb-2">Welcome {userData.name}!</h1>
          <button onClick={logOut} className="bg-[#0288d1] mb-2 p-2 rounded-md font-Mono text-xs md:text-sm text-neutral-200 hover:bg-gray-400 duration-300">
            Log Out
          </button>
          <div className="flex w-auto">
            <img className="h-16 md:h-20 lg:h-36 w-auto" src={userData.avatar.large} alt={`${userData}'s avatar`} />
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-2">Episodes Watched: {userData.statistics.anime.episodesWatched}</h1>
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-2">Chapters Read: {userData.statistics.manga.chaptersRead}</h1>
              <div className="flex items-center p-0 m-0 ">
                <h6 className="font-Roboto text-xs md:text-lg mr-1">Blur 18+ Covers</h6>
                <input className="h-2 md:h-3 outline-none border-none" disabled={!animeRes && !mangaRes} type="checkbox" onChange={()=> setBlurAdult(!blurAdult) }/>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ERROR MESSAGE */}
      {error && <h2 className="text-red-700 text-2xl text-center my-10">{error}</h2>}

      {/* BOTH ENTRIES ARE EMPTY */}
      {token && animeRes?.length === 0 && mangaRes?.length === 0 &&(
        <div className="w-10/12 md:w-7/12 mx-auto my-10">
          <h1 className="text-center my-4 text-lg md:text-2xl font-Roboto font-light text-gray-400 italic">Toukou only tracks Anime/Manga you are CURRENTLY watching/reading or rewatching/rereading via AniList.*</h1>
        </div>
      )}

      {/* ANIME ENTRIES */}
      {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : animeRes?.length > 0 ? (
        <AnimeEntries animeRes={animeRes} blurAdult={blurAdult}/>
      ) : 
        null
      }
      
       {/* Manga ENTRIES */}
       {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : mangaRes?.length > 0 ? (
        <MangaEntries mangaRes={mangaRes} blurAdult={blurAdult}/>
      ) : null}
      
      
    </div>
  )
}

export default App
