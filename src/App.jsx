import React, { useCallback } from "react"
import { useEffect, useState } from 'react'
import useMediaQuery from "./hooks/useMediaQuery"
import { initQuery, mangaQuery, animeQuery } from "./queries"
import Header from "./components/Header"
import Footer from "./components/Footer"
import loadingIcon from "./assets/loading.svg"
import AnimeEntries from "./components/AnimeEntries"
import MangaEntries from "./components/MangaEntries"
import WelcomeSection from "./components/WelcomeSection"
import UserButtons from "./components/UserButtons"

export const url = 'https://graphql.anilist.co'
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
  const isMobile = useMediaQuery('(max-width: 767px)')
  // FOR THE LOGOUT BUTTON
  const logOut = () =>{
    localStorage.removeItem('access_token')
    setToken(null)
    setUserData(null)
    setUserID(null)
    setAnimeRes(null)
    setMangaRes(null)
  }

  // FOR THE CHECK UPDATES BUTTON
  const fetchUpdates = useCallback(()=>{
    if(loading) return; //prevents function if already loading

    setLoading(true)
    if (userID && token) {
      const animeOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: animeQuery,
          variables: { userId: userID }
        })
      };
      const mangaOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: mangaQuery,
          variables: { userId: userID }
        })
      };

      fetch(url, animeOptions)
        .then(response => response.json())
        .then(data => {
          setAnimeRes(data?.data?.MediaListCollection?.lists);
        })
        .catch(e => {
          setError(e.message);
          console.error('Anime Fetch Error:', e.message);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 2500);
        });

      fetch(url, mangaOptions)
        .then(response => response.json())
        .then(data => {
          setMangaRes(data?.data?.MediaListCollection?.lists);
        })
        .catch(e => {
          setError(e.message);
          console.error('Manga Fetch Error:', e.message);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 2500);
        });
        
    } else {
      setLoading(false);
    }
  }, [loading, userID, token])

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
        })
        .catch(e => {
          setError(e.message)
          console.error(e.message)
        })
        .finally(() => setLoading(false))
      
    }
  },[userID, token])

  return (
    <div className="mx-auto flex flex-col min-h-screen overflow-x-hidden">
      
      <Header fetchUpdates={fetchUpdates} logOut={logOut} loading={loading} userData={userData}/>
      {/* WELCOME SECTION */}
      {!token &&
        <WelcomeSection/>
      }

      
      {/* USER INFO */}
      {userData && (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <h1 className="w-9/12 font-Mono font-bold text-lg md:text-2xl mb-2 text-center">Welcome {userData.name}!</h1>
          <div className="flex w-auto">
            {/* USER PROFILE PIC */}
            <div className="h-16 w-16 md:w-32 md:h-32 mr-2 rounded-md">
              <img className="h-full w-full rounded-md object-cover" src={userData.avatar.large} alt={`${userData}'s avatar`} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-1 md:mb-2 tracking-tighter">Episodes Watched: {userData.statistics.anime.episodesWatched}</h1>
              <h1 className="font-Mono font-bold text-sm md:text-xl mb-1 md:mb-2 tracking-tighter">Chapters Read: {userData.statistics.manga.chaptersRead}</h1>
              <div className="flex items-center p-0 m-0 ">
                <h6 className="font-Roboto text-xs md:text-lg mr-1 font-bold">Blur 18+ Covers</h6>
                <input className="h-2 md:h-3 outline-none border-none" disabled={!animeRes && !mangaRes} type="checkbox" onChange={()=> setBlurAdult(!blurAdult) }/>
              </div>
            </div>
          </div>

          {isMobile &&(
            <UserButtons fetchUpdates={fetchUpdates} logOut={logOut} loading={loading} />
          )}
          
        </div>
      )}
      
      {/* ERROR MESSAGE */}
      {error && <h2 className="w-11/12 mx-auto text-red-700 text-2xl text-center my-10 font-Roboto">{error === 'Failed to fetch' ? 'Failed to fetch media. Please slow down on refreshing and try again in a few.' : error}</h2>}

      {/* BOTH ENTRIES ARE EMPTY */}
      {!loading && token && animeRes?.length === 0 && mangaRes?.length === 0 &&(
        <div className="w-10/12 md:w-7/12 mx-auto my-10">
          <h1 className="text-center my-2 text-lg md:text-2xl font-Roboto font-light text-gray-400 italic">Toukou only tracks Anime/Manga you are CURRENTLY watching/reading or rewatching/rereading via AniList.*</h1>
          <h3 className="text-center mb-2 text-sm md:text-lg font-Mono font-bold text-gray-200 tracking-tighter">Visit <a className="text-AniListBlue" href="https://anilist.co/" target="_blank">AniList</a> to add anime/manga to your lists.</h3>

        </div>
      )}

      {/* ANIME ENTRIES */}
      {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : animeRes?.length > 0 ? (
        <AnimeEntries animeRes={animeRes} blurAdult={blurAdult} token={token} fetchUpdates={fetchUpdates}/>
      ) : 
        null
      }
      
       {/* Manga ENTRIES */}
       {loading ? (
        <img src={loadingIcon} className="w-36 mx-auto"/>
      ) : mangaRes?.length > 0 ? (
        <MangaEntries mangaRes={mangaRes} blurAdult={blurAdult} token={token} fetchUpdates={fetchUpdates}/>
      ) : null}
      
      <Footer/>
      
    </div>
  )
}

export default App
