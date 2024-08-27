import React from 'react'

const Header = () => {
  return (
    <header className="py-5 flex flex-col justify-center items-center overflow-x-visible bg-[#152232]">
        <h1 className="text-5xl tracking-wide font-Title mb-1 text-neutral-200 select-none">TOU<span className="text-[#02a9ff]">KOU</span></h1>
        <h3 className="text-xl tracking-widest font-Japanese font-black mb-1">投<span className="text-[#02a9ff]">稿</span></h3>
        <h5 className="text-xs tracking-widest font-Roboto font-extralight mb-1 select-none">A Client for AniList</h5>
      </header>
  )
}

export default Header