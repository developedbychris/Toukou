import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-auto bg-HeaderBG text-neutral-200 py-4 text-center flex items-center justify-around">
      <div>
        <h1 className="text-lg md:text-2xl xl:text-4xl tracking-wide font-Title text-neutral-200 select-none">TOU<span className="text-AniListBlue">KOU</span></h1>
        <h3 className="text-sm md:text-xl tracking-widest font-Japanese font-black mb-1">投<span className="text-AniListBlue">稿</span></h3>
      </div>
      <div className="">
        <a href="https://x.com/ToukouApp" target="_blank">
            <h1 className="mb-2 text-lg md:text-2xl xl:text-3xl font-Roboto font-black hover:text-TwitterBlue duration-200">Twitter</h1>
        </a>
        <a href="https://anilist.co/" target="_blank">
            <h1 className="text-lg md:text-2xl xl:text-3xl font-Roboto font-black text-neutral-200 hover:text-AniListBlue duration-200">Ani<span className="text-AniListBlue">List</span></h1>
        </a>
      </div>
    </footer>
  )
}

export default Footer