import { useEffect, useState } from 'react'
import { initQuery, mangaQuery, animeQuery } from "./queries"
const url = 'https://graphql.anilist.co'
const borderStyles = "p-5 border-t-[#02a9ff] border-r-[#174c66] border-4 rounded-md h-80"

function App() {
  const [animeRes, setAnimeRes] = useState(null)
  const [mangaRes, setMangaRes] = useState(null)
  const [userData, setUserData] = useState(null) 
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("access_token"))
  const [userID, setUserID] = useState(null)
  // fuwn id: 5678223
  const getStatusLabel = (status) => {
    switch (status) {
      case "REPEATING":
        return "Rewatching"
      case "CURRENT":
        return "Currently Watching"
      default:
        return status
    }
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
      fetch(url, options)
        .then(data => data.json())
        .then(data =>{
          setUserID(data.data.Viewer.id)
          setUserData(data.data.Viewer)
        })
        .catch(e => setError(e.message))
    }
  }, [token])

  //* ANILIST USERID USEEFFECT
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

      fetch(url, animeOptions)
        .then(data => data.json())
        .then(data => {
          setAnimeRes(data.data.MediaListCollection.lists)
          console.log(data.data.MediaListCollection.lists);
        })
        .catch(e => setError(e.message))
      
      fetch(url, mangaOptions)
        .then(data => data.json())
        .then(data =>{
          setMangaRes(data.data.MediaListCollection.lists)
        })
        .catch(e => setError(e.message))
    }

  },[userID])

  return (
    <div className="mx-auto flex flex-col">
      
      <header className="py-6 flex flex-col justify-center items-center overflow-x-visible bg-[#152232] ">
        <h1 className="text-5xl font-Title mb-2 text-neutral-200 select-none">TOU<span className="text-[#02a9ff]">KOU</span></h1>
        <h3 className="text-2xl font-Japanese font-black">投<span className="text-[#02a9ff]">稿</span></h3>
        <h5></h5>
      </header>
      
      {/* <button className="mx-auto flex justify-items-center" onClick={()=> console.log("here's the response",res, "\n\nhere's the token:", token)}>log this</button> */}
      
      {!token && 
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-2xl mb-4 font-Mono select-none">Connect Your AniList Account</h1>
        <a href='https://anilist.co/api/v2/oauth/authorize?client_id=20510&response_type=token'>
          <button className="bg-[#02a9ff] px-4 py-2 rounded-lg font-Mono text-2xl ">Login With AniList</button>
        </a>
      </div>
      }
      {error && <h2 className="text-red-700 text-2xl flex justify-center my-10">{error}</h2>}

      {/* USER INFO / WELCOME SECTION */}
      {userData && (
        <div className="py-6 w-full mx-auto flex flex-col items-center justify-center mb-20 select-none bg-slate-900 profileclip">
          <h1 className="font-Mono font-bold text-2xl mb-5">Welcome {userData.name}!</h1>
          <div className="flex">
            <img src={userData.avatar.medium} alt={`${userData}'s avatar`} />
            <div className="flex flex-col items-start justify-center">
              <h1 className="font-Mono font-bold text-md mb-5">Episodes Watched: {userData.statistics.anime.episodesWatched}</h1>
              <h1 className="font-Mono font-bold text-md">Chapters Read: {userData.statistics.manga.chaptersRead}</h1>
            </div>
          </div>
        </div>
      )}

      {/* ANIME ENTRIES */}
      {animeRes?.length > 0 ? (
        <>
        {
        
        animeRes.map((list)=>(
        <>
          <div className="w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none">
            <h1 className="text-4xl">ANIME</h1>
            <h1 className="text-lg">{list.isCustomList ? list.name : getStatusLabel(list.status)}</h1>
          </div>
          <div className="flex justify-between items-center w-10/12 mx-auto mb-20">
          
          {list.entries.map((anime, i) => (
            <div key={anime.id} className={`flex-1 ${borderStyles} flex flex-col justify-center items-center ${i === animeRes.length -1 ? "" : "mr-6"}`}>
              <h1 className="text-center mb-2 font-Mono text-sm">{anime?.media?.title.english}</h1>
              <img className="m-auto h-56 shadow-md shadow-[#02a9ff] mb-2" src={anime.media.coverImage.large} alt={anime?.media?.title.english} />
              <h1 className="text-center mb-2 font-Mono text-sm">{anime.progress} / {anime.media.episodes}</h1>
            </div>
          ))}
          </div>
        </>
        ))
        }
        
        </>
      ) : null}

       {/* Manga ENTRIES */}
       {/* {mangaRes?.length > 0 ? (
        <>
        <div className="w-10/12 mx-auto flex flex-col justify-center items-center mb-6 font-Mono font-black select-none">
          <h1 className="text-4xl">Manga</h1>
          <h1 className="text-lg">Currently Reading</h1>
        </div>

        <div className="flex justify-between items-center w-10/12 mx-auto">
          {mangaRes.map((manga, i) => (
            <div key={manga.id} className={`flex-1 ${borderStyles} flex flex-col justify-center items-center ${i === mangaRes.length -1 ? "" : "mr-6"}`}>
              <h1 className="text-center mb-2 font-Mono text-sm">{manga?.media?.title.english}</h1>
              <img className="m-auto h-56 shadow-md shadow-[#02a9ff] mb-2" src={manga.media.coverImage.large} alt={manga?.media?.title.english} />
              <h1 className="text-center mb-2 font-Mono text-sm">{manga.progress} / {manga.media.chapters}</h1>
            </div>
          ))}
        </div>
        </>
      ) : null} */}

    </div>
  )
}

export default App
