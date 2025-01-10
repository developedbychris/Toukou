import { useEffect, useState } from "react"
import UserButtons from "./UserButtons"
import PlatformModal from "./PlatformModal"
import AtpAgent from "@atproto/api"

function UserInfo({userData, animeRes, mangaRes, setBlurAdult, blurAdult, isMobile, fetchUpdates, logOut, loading, platform, setPlatform,
    username, setUsername, password, setPassword, authenticated, setAuthenticated, agent, setAgent
}) {

    const [isModalOpen, setModal] = useState(false)
    
    const [handle, setHandle] = useState(null)
    const [_, setSession] = useState(null)

    useEffect(()=>{
        const savedPlatform = localStorage.getItem('preferredPlatform')

        if (savedPlatform) {
            setPlatform(savedPlatform)
        } else{
            setPlatform('X / Twitter')
        }
    },[setPlatform])

    useEffect(() => {
        const newAgent = new AtpAgent({
            service: 'https://bsky.social',
            persistSession: (evt, sess) => {
                if (evt === 'update' && sess) {
                // Store session in localStorage when updated
                localStorage.setItem('bskySession', JSON.stringify(sess));
                }
            }
        })
      
        setAgent(newAgent)
      
        // Try to resume the session if it was saved
        const savedSession = localStorage.getItem('bskySession');
        if (savedSession) {
          const sessionData = JSON.parse(savedSession)
          newAgent
            .resumeSession(sessionData)
            .then(() => {
              setSession(sessionData)
              setHandle(sessionData.handle)
              setAuthenticated(true)
              console.log('Session resumed')
            })
            .catch((err) => {
              console.error('Failed to resume session:', err)
              localStorage.removeItem('bskySession')
            })
        }
      }, [])

    const handlePlatformChange = (value) =>{
        const newPlatform = value === platform ? null : value
        setPlatform(newPlatform)

        if (newPlatform){
            localStorage.setItem('preferredPlatform', newPlatform)
        } else{
            localStorage.removeItem('preferredPlatform')
        }
    }

    return (
    <>
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
                <h5 className="font-Roboto text-xs md:text-lg mr-1">Using <span className="font-bold text-AniListBlue">{platform}</span></h5>
                {platform === 'Bluesky' && authenticated && (<h5 className="font-Roboto text-xs md:text-base mr-1">Signed In ✅</h5>)}
                {platform === 'Bluesky' && !authenticated && (<h5 className="font-Roboto text-xs md:text-base mr-1">⚠️Not Signed In</h5>)}
                <h5 className="font-Roboto text-xs md:text-lg mr-1 font-bold border-b border-AniListBlue hover:text-AniListBlue hover:cursor-pointer duration-200" onClick={()=> setModal(true)}>Manage Platforms</h5>
            </div>
        </div>

        {isMobile &&(
            <UserButtons fetchUpdates={fetchUpdates} logOut={logOut} loading={loading} />
        )}
        
    </div>
    {isModalOpen && (<PlatformModal platform={platform} handlePlatformChange={handlePlatformChange} isMobile={isMobile} closeModal={()=>setModal(false)} 
        username={username} setUsername={setUsername} password={password} setPassword={setPassword} authenticated={authenticated} setAuthenticated={setAuthenticated}
        handle={handle} setHandle={setHandle} setSession={setSession} agent={agent}/>)}
    </>
  )
}

export default UserInfo