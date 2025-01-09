import React from 'react'
import { RiCloseCircleFill } from "react-icons/ri"
function PlatformModal({platform, handlePlatformChange, isMobile, closeModal, username, setUsername, password, setPassword}) {
    
    //* need to add handle functions from test

    const handleUsernameChange = (e) => setUsername(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)
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
                <h4 className="mb-2 text-sm md:text-base">X / Twitter <input className="mr-3" type="checkbox" checked={platform === 'x'} onChange={()=> handlePlatformChange('x')}/></h4>
                <h4 className="text-sm md:text-base">Bluesky <input type="checkbox" checked={platform === 'bsky'} onChange={()=> handlePlatformChange('bsky')}/></h4>
                {platform === 'bsky' ? (
                    <div className="mt-7">
                        <h2 className="font-Roboto font-bold text-xl md:text-2xl text-center">Sign into Bluesky</h2>
                        <form className="mt-4 w-full">
                            <div className="flex flex-col justify-center w-96">
                                <h2 className="mr-2">Bsky Handle</h2>
                                <input type="text" placeholder="User.bsky.social" className="font-sans text-center rounded-sm mb-3 bg-neutral-200 text-black" onChange={(e)=> handleUsernameChange(e)}/> 
                                <h2 className="mr-2">Password</h2>
                                <input type="password" placeholder="Password" className="font-sans text-center rounded-sm bg-neutral-200 text-black" onChange={(e)=> handlePasswordChange(e)}/> <br/>
                                <button className="bg-BlueskyBlue px-3 py-2 rounded-lg font-Mono text-lg md:text-xl text-neutral-200 hover:bg-green-500 duration-300" type="submit">Log In</button>
                            </div>
                        </form>
                    </div>
                ) : (
                null
            )}
            </div>
        </div>
    </div>
  )
}

export default PlatformModal