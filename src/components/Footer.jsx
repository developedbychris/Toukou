import React from 'react'
import TKLogo from "../assets/TKLogo.png"
const handleClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const Footer = () => {
  
  return (
    <footer className="mt-auto bg-HeaderBG text-neutral-200 py-4 text-center flex items-center justify-between px-6 md:px-12 lg:px-32 xl:px-48 font-Roboto font-semibold">
      <img src={TKLogo} alt="Toukou Logo" className="w-20 select-none hover:cursor-pointer" onClick={handleClick}/>
      <div className="flex-col flex items-center justify-center">
        <a href="https://x.com/ToukouApp" target="_blank">
          <h1 className="mb-2 md:mb-7 text-lg md:text-2xl xl:text-3xl hover:text-TwitterBlue duration-200">Twitter</h1>
        </a>
        <a href="https://anilist.co/" target="_blank">
          <h1 className="text-lg md:text-2xl xl:text-3xl hover:text-AniListBlue duration-200">Ani<span className="text-AniListBlue">List</span></h1>
        </a>
      </div>
    </footer>
  )
}

export default Footer