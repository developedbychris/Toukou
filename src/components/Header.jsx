import useMediaQuery from "../hooks/useMediaQuery"
import UserButtons from "./UserButtons"

const Header = ({fetchUpdates, logOut, loading, userData}) => {
  const isTablet = useMediaQuery('(min-width: 768px)')
  return (
    <header className={`px-10 lg:px-24 py-5 ${userData && isTablet ? "flex items-center justify-between" :"" }  bg-HeaderBG`}>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl tracking-wide font-Title mb-0 md:mb-1 text-neutral-200 select-none">TOU<span className="text-AniListBlue">KOU</span></h1>
          <h3 className="text-xl tracking-widest font-Japanese font-black mb-1">投<span className="text-AniListBlue">稿</span></h3>
          <h5 className="text-xs tracking-widest font-Roboto font-extralight select-none mb-1">A Client for AniList</h5>
        </div>

        {userData && isTablet && (
          
        <UserButtons fetchUpdates={fetchUpdates} logOut={logOut} loading={loading}/>
        )}
      </header>
  )
}

export default Header