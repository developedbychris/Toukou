import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

const url = 'https://graphql.anilist.co'
const initQuery = `
  query{
    Viewer{
      id
    }
  }
`
const collectionQuery = `
  query($userId: Int!) {
    MediaListCollection(userId: $userId, status_in: [CURRENT, REPEATING], type: ANIME) {
      lists {
        entries {
          id
          media {
            episodes
            coverImage {
              large
              color
            }
            id
            title {
              romaji
              english
              native
            }
            type
            format
          }
          status
          progress
        }
      }
    }
}

`
function App() {
  const [res, setRes] = useState(null)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(null)
  const [userID, setUserID] = useState(null)

  useEffect(()=>{
    const hash = window.location.hash.substring(1) // Remove the '#' from the beginning
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: initQuery,
        variables: {}
      })
    }
    // Runs when token is registered
    if (token) {
      setToken(token)
      fetch(url, options)
        .then(data => data.json())
        .then(data => setUserID(data.data.Viewer.id))
        .catch(e => setError(e.message))
      window.history.replaceState(null, null, window.location.pathname)
    }

    

  }, [])

  useEffect(()=>{
    if(userID){
      const collectionOptions = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: collectionQuery,
          variables: {userId: userID}
        })
      }

      fetch(url, collectionOptions)
        .then(data => data.json())
        .then(data => setRes(data.data.MediaListCollection.lists[0].entries))
        .catch(e => setError(e.message))
    }

  },[userID])

  return (
    <div>
      {error && <p>{error}</p>}

      <button onClick={()=> console.log("here's the response",res)}>log this</button>

      {!token && <a className="" href='https://anilist.co/api/v2/oauth/authorize?client_id=20510&response_type=token'>
        <button className="bg-black px-4 py-2 rounded-lg">Login With AniList</button>
      </a>
      }

      {token && <p>Token is set</p>}
      
      {res && res?.map((anime)=>(
        <h1 key={anime.id}>{anime?.media?.title.english}</h1>
      ))}
    </div>
  )
}

export default App
