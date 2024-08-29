import React from 'react'
import TKLogo from "../assets/TKLogo.png"
const Footer = () => {
  return (
    <footer className="mt-auto bg-HeaderBG text-neutral-200 py-4 text-center flex items-center justify-around">
      <img src={TKLogo} alt="Toukou Logo" className="w-20 select-none" />
      <div className="">
        <a href="https://x.com/ToukouApp" target="_blank">
            <h1 className="mb-2 md:mb-4 text-lg md:text-2xl xl:text-3xl font-Roboto font-black hover:text-TwitterBlue duration-200">Twitter</h1>
        </a>
        <a href="https://anilist.co/" target="_blank">
            <h1 className="text-lg md:text-2xl xl:text-3xl font-Roboto font-black text-neutral-200 hover:text-AniListBlue duration-200">Ani<span className="text-AniListBlue">List</span></h1>
        </a>
      </div>
    </footer>
  )
}

export default Footer