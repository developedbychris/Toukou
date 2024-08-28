import React from "react"
import { useEffect, useState } from 'react'
import { initQuery, mangaQuery, animeQuery } from "./queries"
import Header from "./components/Header"
import Footer from "./components/Footer"
import loadingIcon from "./assets/loading.svg"
import AnimeEntries from "./components/AnimeEntries"
import MangaEntries from "./components/MangaEntries"

import WelcomeSection from "./components/WelcomeSection"
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
  const [userID, setUserID] = useState(6890331)
  const [blurAdult, setBlurAdult] = useState(false)
  const [refresh, setRefresh] = useState(false)

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
  },[userID, refresh])

  return (
    <div className="mx-auto flex flex-col min-h-screen">
      
      <Header/>
      {/* WELCOME SECTION */}
      {!token &&
        <WelcomeSection/>
      }

      
      {/* USER INFO */}
      {loading ? (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <img src={loadingIcon} className="w-36 mx-auto"/>
        </div>
      ) : userData && (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <h1 className="font-Mono font-bold text-2xl mb-2">Welcome {userData.name}!</h1>
          <div className="flex w-auto">
            {/* USER PROFILE PIC */}
            <div className="h-16 w-16 md:w-32 md:h-32 mr-2 rounded-md">
              <img className="h-full w-full rounded-md object-cover" src={userData.avatar.large} alt={`${userData}'s avatar`} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-1 md:mb-2 tracking-tighter">Episodes Watched: {userData.statistics.anime.episodesWatched}</h1>
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-1 md:mb-2 tracking-tighter">Chapters Read: {userData.statistics.manga.chaptersRead}</h1>
              <div className="flex items-center p-0 m-0 ">
                <h6 className="font-Roboto text-xs md:text-lg mr-1">Blur 18+ Covers</h6>
                <input className="h-2 md:h-3 outline-none border-none" disabled={!animeRes && !mangaRes} type="checkbox" onChange={()=> setBlurAdult(!blurAdult) }/>
              </div>
            </div>
          </div>
          {/* BUTTONS */}
          <div className="mt-5 w-2/12 mx-auto flex items-center justify-between">
          <button onClick={()=> setRefresh(prev => !prev)} className="bg-AniListBlue mb-2 p-2 rounded-lg font-Mono text-xs md:text-sm text-neutral-200 hover:bg-AniListDarkBlue duration-300">
              Check for Updates
            </button>
            <button onClick={logOut} className="bg-red-600 mb-2 p-2 rounded-md font-Mono text-xs md:text-sm text-neutral-200 hover:bg-gray-700 duration-300">
              Log Out
            </button>
          </div>
        </div>
      )}
      
      {/* ERROR MESSAGE */}
      {error && <h2 className="text-red-700 text-2xl text-center my-10 font-Roboto">{error}</h2>}

      {/* BOTH ENTRIES ARE EMPTY */}
      {token && animeRes?.length === 0 && mangaRes?.length === 0 &&(
        <div className="w-10/12 md:w-7/12 mx-auto my-10">
          <h1 className="text-center my-2 text-lg md:text-2xl font-Roboto font-light text-gray-400 italic">Toukou only tracks Anime/Manga you are CURRENTLY watching/reading or rewatching/rereading via AniList.*</h1>
          <h3 className="text-center mb-2 text-sm md:text-lg font-Mono font-bold text-gray-200 tracking-tighter">Visit <a className="text-AniListBlue" href="https://anilist.co/" target="_blank">AniList</a> to add anime/manga to your lists.</h3>

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
      
      <Footer/>
      
    </div>
  )
}

export default App
