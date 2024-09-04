import chika from "../assets/chika.gif"
import Accordion from "./Accordion/Accordion"
import { FAQtext } from "../faq"
const WelcomeSection = () => {
  return (
    <>
        <div className="mt-10 w-10/12 md:w-9/12 xl:w-5/12 mx-auto flex flex-col justify-center items-center">
          <h1 className="text-center text-4xl md:text-6xl mb-2 font-Roboto font-black select-none text-neutral-200">Welcome to Toukou!</h1>
          <img className="rounded-lg w-40 mb-4" src={chika} alt="gif of mayuri from steins;gate" />
          <p className="leading-relaxed text-lg md:text-3xl mb-12 font-Roboto text-center text-neutral-200 select-none">
            Link your AniList account to Toukou to effortlessly update your anime and manga progress.
            <br/><br/> Share your updates directly to Twitter/X and keep your friends in the loop!
          </p>

          <a href='https://anilist.co/api/v2/oauth/authorize?client_id=20510&response_type=token'>
            <button className="bg-[#02a9ff] px-6 py-3 rounded-lg font-Mono text-lg md:text-2xl text-neutral-200 hover:bg-[#0288d1] duration-300">
              Login With AniList
            </button>
          </a>

          <div className="w-11/12 md:w-7/12 mx-auto my-5">
            <h1 className="text-center my-4 text-sm md:text-lg font-Roboto font-light text-gray-400 italic select-none">Toukou only tracks Anime/Manga you are <u> currently</u> watching/reading or rewatching/rereading via AniList.
            <br/> This does NOT include anime/manga you have completed.*</h1>
          </div>
        </div>
        <div className="md:mt-20 mb-10 w-10/12 md:w-9/12 xl:w-5/12 mx-auto">
          <h1 className="text-neutral-300 text-start text-lg md:text-2xl font-Roboto font-bold mb-5">F.A.Q (Frequently Asked Questions)</h1>
          <Accordion faq={true} title={FAQtext.why.title} content={FAQtext.why.content}/>
          <Accordion faq={true} title={FAQtext.free.title} content={FAQtext.free.content}/>
          <Accordion faq={true} title={FAQtext.how.title} content={FAQtext.how.content}/>
          <Accordion faq={true} title={FAQtext.kanji.title} content={FAQtext.kanji.content}/>
        </div>
      </> 
  )
}

export default WelcomeSection