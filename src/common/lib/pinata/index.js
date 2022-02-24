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

export const decryptFile = (obj, pair, type) => {
  const box = Object.values(obj[0].data.box)
  const nonce = Object.values(obj[0].data.nonce)
  let decryptedFile

  const toDecrypt = {
    box: Uint8Array.from(box),
    nonce: Uint8Array.from(nonce)
  }

  if (type === "application/pdf") decryptedFile = Kilt.Utils.Crypto.decryptAsymmetric(toDecrypt, pair.publicKey, pair.secretKey)
  else decryptedFile = Kilt.Utils.Crypto.decryptAsymmetricAsStr(toDecrypt, pair.publicKey, pair.secretKey)

  if (!decryptedFile) console.log("Undefined File", decryptedFile)
  else return decryptedFile
}

export const downloadDocumentFile = (data, fileName, type) => {
  try {
    const blob = new Blob([data], { type })
    const e = document.createEvent("MouseEvents")
    const a = document.createElement("a")
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":")
    e.initEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    a.dispatchEvent(e)
  } catch (error) {
    console.error(error)
  }
}

