import DOMPurify from "dompurify";

const handleTitles = (title) => title.length <= 50 ? title : `${title.slice(0,50)}...`

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
            return "Re-watching"
        case status === "CURRENT" && type === "anime":
            return "Currently Watching"
        case status === "REPEATING" && type === "manga":
            return "Re-reading"
        case status === "CURRENT" && type === "manga":
            return "Currently Reading"
        default:
            return status
    }
}

const getModalStatusLabel = (status, format) => {
    switch (true) {
        case status === "CURRENT" && format === "TV":
            return "watched"
        case status === "REPEATING" && format === "TV":
            return "re-watched"
        case status === "CURRENT" && format === "MANGA":
            return "read"
        case status === "REPEATING" && format === "MANGA":
            return "re-read"
        case status === "CURRENT" && format === "MOVIE":
            return "watched"
        case status === "REPEATING" && format === "MOVIE":
            return "re-watched"
        case status === "CURRENT" && format === "SPECIAL":
            return "watched"
        case status === "REPEATING" && format === "SPECIAL":
            return "re-watched"
        case status === "CURRENT" && format === "OVA":
            return "watched"
        case status === "REPEATING" && format === "OVA":
            return "re-watched"
        case status === "CURRENT" && format === "ONA":
            return "watched"
        case status === "REPEATING" && format === "ONA":
            return "re-watched"
        case status === "CURRENT" && format === "MUSIC":
            return "watched"
        case status === "REPEATING" && format === "MUSIC":
            return "re-watched"
        case status === "CURRENT" && format === "NOVEL":
            return "read"
        case status === "REPEATING" && format === "NOVEL":
            return "re-read"
        case status === "CURRENT" && format === "ONE_SHOT":
            return "read"
        case status === "REPEATING" && format === "ONE_SHOT":
            return "re-read"
        default:
            return status.toLowerCase()
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

const getFormatLabel = (format) =>{
    switch (format){
        case "TV":
            return "Episode"
        case "TV_SHORT":
            return "Episode"
        case "MOVIE":
            return "Episode"
        case "SPECIAL":
            return "Episode"
        case "OVA":
            return "Episode"
        case "ONA":
            return "Episode"
        case "MUSIC":
            return "Episode"
        case "MANGA":
            return "Chapter"
        case "NOVEL":
            return "Chapter"
        case "ONE_SHOT":
            return "Chapter"
    }
}
const getRatingColor = (score) => {
    if (score >= 85) return '#22c55e';   
    if (score >= 70) return '#84cc16';   
    if (score >= 55) return '#facc15';   
    if (score >= 40) return '#fb923c';  
    return '#ef4444';                   
}
const months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" 
]
const getOrdinal = (n)=> {
    let ord = 'th';
  
    if (n % 10 == 1 && n % 100 != 11)
    {
      ord = 'st';
    }
    else if (n % 10 == 2 && n % 100 != 12)
    {
      ord = 'nd';
    }
    else if (n % 10 == 3 && n % 100 != 13)
    {
      ord = 'rd';
    }
  
    return n + ord
}
export {
    handleTitles, createSanitizedHtml,
    handleBlur, getStatusLabel, 
    getMediaStatuslabel, getFormatLabel, 
    getModalStatusLabel, months, 
    getOrdinal, getRatingColor
}