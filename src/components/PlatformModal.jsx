import React, { useState } from 'react'
import { RiCloseCircleFill } from "react-icons/ri"
function PlatformModal({platform, handlePlatformChange, isMobile, closeModal, username, setUsername, password,
    setPassword, authenticated, setAuthenticated, handle, setHandle, agent, setSession}) {
    
    //* need to add handle functions from test

    const handleUsernameChange = (e) => setUsername(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)
    const [loginError, setLoginError] = useState(null)
    const signOut = () =>{
        localStorage.removeItem('bskySession')
        setAuthenticated(false)
    }
    

    const handleIdentifier = ()=>{
        if(username.includes('.')){
            return username
        } else {
            return username + '.bsky.social'
        }
    }

    const authenticate = async () => {
        if (!agent) return
    
        try {
          const res = await agent.login({
            identifier: handleIdentifier(),
            password: password
          })
    
          const sessionData = res.data
          // Store session in localStorage to persist it across refreshes
          localStorage.setItem('bskySession', JSON.stringify(sessionData))
          setSession(sessionData)
          setAuthenticated(true)
          setHandle(sessionData.handle)
          console.log('Successfully authenticated')
          console.log('Session after login:', sessionData)
          console.log('accessjwt:', sessionData.accessJwt);
          console.log('did:', sessionData.did);
        } catch (error) {
          console.error('Authentication Failed:', error)
          setLoginError(error.message)
          console.log(error.message);
        }
      }
    const handleEnterKey = e => e.key === 'Enter' && authenticate()

    return (
    <div className="w-full h-full top-0 left-0 fixed overflow-x-hidden z-50">
        {/* OVERLAY */}
        <div className="w-full h-full top-0 left-0 fixed  bg-[rgba(49,49,49,0.8)] overflow-hidden" onClick={isMobile ? closeModal : null}/>
        {/* MODAL CONTENT */}
        <div className="modal-content h-[45vh] px-10 py-5  w-11/12 md:w-11/12 lg:w-10/12 xl:w-5/12 rounded-xl mx-auto mt-10 border-b-2 border-l-2 border-AniListBlue ">
            <div className="flex justify-end">
                <RiCloseCircleFill className={`close-btn scale-150 duration-200 hover:cursor-pointer`} onClick={closeModal}/>
            </div>
            <div className="w-full h-[90%] flex flex-col justify-center items-center font-Mono">
                <h1 className="font-Roboto font-bold text-2xl md:text-4xl mb-4 text-center">Select a Platform</h1>
                <h4 className="mb-2 text-sm md:text-base">X / Twitter <input className="mr-3" type="checkbox" checked={platform === 'X / Twitter'} onChange={()=> handlePlatformChange('X / Twitter')}/></h4>
                <h4 className="text-sm md:text-base">Bluesky <input type="checkbox" checked={platform === 'Bluesky'} onChange={()=> handlePlatformChange('Bluesky')}/></h4>
                {platform === 'Bluesky' && !authenticated && (
                    <div className="mt-7">
                        <h2 className="font-Roboto font-bold text-xl md:text-2xl text-center">Sign into Bluesky</h2>
                        <form className="mt-4 w-full" onSubmit={e => e.preventDefault()}>
                            <div className="flex flex-col justify-center w-96">
                                <div className="flex flex-col w-full">
                                    <h2 className="mr-2 text-center">Bsky Handle</h2>
                                    <input type="text" placeholder="User.bsky.social" className="font-sans text-center rounded-sm mb-3 bg-neutral-200 text-black w-4/5 md:w-full mx-auto" onChange={(e)=> handleUsernameChange(e)}/>
                                </div>

                                <div className="flex flex-col w-full">
                                    <h2 className="mr-2 text-center">Password</h2>
                                    <input type="password" placeholder="Password" className="font-sans text-center rounded-sm bg-neutral-200 text-black w-4/5 md:w-full mx-auto" onChange={(e)=> handlePasswordChange(e)} onKeyDown={handleEnterKey}/>
                                </div>
                                 <br/>
                                {loginError ? <h6 className="text-center mb-2 text-xs md:text-sm font-Roboto font-light text-red-600 select-none">{loginError}</h6> : <h6 className="text-center mb-2 text-xs md:text-sm font-Roboto font-light text-gray-400 italic select-none">Toukou DOES NOT store any of your information.</h6>}
                                <button className="bg-BlueskyBlue px-3 py-2 rounded-lg font-Mono text-lg md:text-xl text-neutral-200 hover:bg-green-500 duration-300" onClick={authenticate}>Log In</button>
                            </div>
                        </form>
                    </div>
                )}
                {platform === 'Bluesky' && authenticated && (
                    <div className="mt-7">
                        <h2 className="font-Roboto font-bold text-xl md:text-2xl text-center">Signed in as <br/><span className="font-black block mt-4 text-BlueskyBlue"><a className="hover:border-b border-BlueskyBlue" target="_blank" href={`https://bsky.app/profile/${handle}`}>{handle}</a></span></h2>
                        <button className="mt-4 bg-BlueskyBlue block mx-auto px-3 py-2 rounded-lg font-Mono text-lg md:text-xl text-neutral-200 hover:bg-red-500 duration-300" onClick={signOut}>Sign Out</button>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default PlatformModal