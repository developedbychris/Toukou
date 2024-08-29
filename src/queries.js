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
        status  
        name
        isCustomList
        entries {
          id
          media {
            episodes
            hashtag
            description(asHtml: true)
            status
            coverImage {
              large
              color
            }
            isAdult
            siteUrl
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
        status
        name
        isCustomList
        entries {
          id
          media {
            chapters
            hashtag
            description(asHtml: true)
            status
            coverImage {
              large
              color
            }
            isAdult
            siteUrl
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

const mediaProgressMutation = `
  mutation SaveMediaListEntry($mediaId: Int!, $progress: Int!, $status: MediaListStatus) {
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) {
      progress
    	status
    }
  }
`
export { initQuery, animeQuery, mangaQuery, mediaProgressMutation }
