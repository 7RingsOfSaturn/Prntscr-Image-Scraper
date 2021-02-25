const Axios = require(`axios`)
const HTTPS = require(`https`)
const FileSystem = require("fs")

function RandomId(Length) {
    const Characters = (`0123456789abcdefghijklmnopqrstuvwxyz`).split("")
    let Id = ``

    for (let i = 0; i < Length; i++) {
        const Character = Characters[Math.floor(Math.random() * Characters.length)]

        Id = Id + Character
    }

    return Id
}

async function DownloadFile(Directory, URL) {
    const DownloadPromise = new Promise((Resolve) => {
        const Stream = FileSystem.createWriteStream(Directory)

        const Request = HTTPS.request(URL, function(Response) {
            Response.pipe(Stream)
        })

        Stream.on(`finish`, () => {
            Stream.close(Resolve)
        })

        Request.end()
    })
    
    return DownloadPromise
}

async function Scrape(Count, IdLength) {
    const Downloads = []

    for (let i = 0; i < Count; i++) {
        const Id = RandomId(IdLength)
        const URL = `https://prnt.sc/${Id}`

        const Request = Axios.get(URL)
        const Response = await Request

        let ImageURL = Response.data.match(/<img class="no-click screenshot-image" src="(.*?)"/)

        if (ImageURL) {
            ImageURL = ImageURL[1]
            
            if (ImageURL != `//st.prntscr.com/2021/02/09/0221/img/0_173a7b_211be8ff.png`) {
                console.log(ImageURL)
                await DownloadFile(`./Pages/${Id}.png`, ImageURL)
            }
        }
    }

    await Promise.all(Downloads)
    
    console.log("DONE!")
}

Scrape(10000, 6)
