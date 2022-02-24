const pinataJwtKey = process.env.VUE_APP_PINATA_JWT_KEY
import { uploadFile } from "@debionetwork/pinata-ipfs"


export async function uploadFileToPinata (val) { 
  
  const file = val.file
  const options = {
    pinataMetadata: {
      name: `${val.title}`
    },
    pinataOptions: {
      cidVersion: 0
    }
  }

  const result = await uploadFile(options, file, pinataJwtKey)
  return result
}

export function getFileUrl (cid) {
  return `${process.env.VUE_APP_PINATA_GATEWAY}/ipfs/${cid}`
}

export async function downloadFile(link) {
  console.log("Downloading..")
  const result = await fetch(link)
  const data = await result.json()
  console.log("Downloaded !")
  return data
}
