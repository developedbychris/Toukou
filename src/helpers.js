import DOMPurify from "dompurify";

const handleTitles = (title) => title.length <= 50 ? title : `${title.slice(0,50)}...`

const handleModalDescription = (desc) => desc.length <= 900 ? desc : `${desc.slice(0,900)}...`

function createSanitizedHtml(html) {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }); // removes all tags
}

const handleBlur = (isAdult, blurAdult) =>{
    if(isAdult && blurAdult){
        return "blur-sm"
    } else{
        return ""
    }
}


const getStatusLabel = (status, type) => {
    switch (true) {
        case status === "REPEATING" && type === "anime":
            return "Rewatching"
        case status === "CURRENT" && type === "anime":
            return "Currently Watching"
        case status === "REPEATING" && type === "manga":
            return "Rereading"
        case status === "CURRENT" && type === "manga":
            return "Currently Reading"
        default:
            return status
    }
}
const getMediaStatuslabel = (status) =>{
    switch(status){
        case "RELEASING":
            return "Ongoing"
        case "NOT_YET_RELEASED":
            return "Unreleased"
        default:
            return status
    }
}

export {handleTitles, handleModalDescription, createSanitizedHtml, handleBlur, getStatusLabel, getMediaStatuslabel}