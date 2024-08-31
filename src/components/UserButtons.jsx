import React from 'react'
import useMediaQuery from "../hooks/useMediaQuery"
import { SlLogout } from "react-icons/sl"

const UserButtons = ({fetchUpdates, logOut, loading}) => {
  const isTablet = useMediaQuery('(min-width: 768px)')
  const isTabletAndMobile = useMediaQuery('(max-width: 1023px)')
  return (
    <div className={`mt-5 md:mt-0 w-5/12 md:w-3/12 xl:w-[15%] flex flex-col items-center justify-center`}>
        <button disabled={loading} onClick={()=> fetchUpdates()} className={`bg-AniListDarkBlue lg:bg-transparent hover:bg-AniListBlue lg:hover:bg-AniListDarkBlue duration-300 mb-4 w-full p-2 rounded-lg font-Mono text-xs md:text-sm text-neutral-200 `}>
        {loading ? 'Loading...' : 'Check for Updates'}
        </button>
        <button onClick={logOut} className={`bg-red-900 lg:bg-transparent hover:bg-red-600 lg:hover:bg-red-900 w-full p-2 rounded-lg font-Mono text-sm md:text-lg text-neutral-200 duration-300`}>
            <SlLogout className="inline-block mr-3"/>
            Log Out
        </button>
    </div>
  )
}
export default UserButtons