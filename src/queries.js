const initQuery = `
  query{
    Viewer{
        id
        name
        avatar{
            large
            medium
        }
        statistics{
            anime{
                episodesWatched
            }
            manga{
                chaptersRead
            }
        }    
    }
  }
`

const animeQuery = `
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
const mangaQuery = `
  query($userId: Int!) {
    MediaListCollection(userId: $userId, status_in: [CURRENT, REPEATING], type: MANGA) {
      lists {
        entries {
          id
          media {
            chapters
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
export { initQuery, animeQuery, mangaQuery }
