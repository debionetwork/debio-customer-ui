import axios from "axios";
import NodeFormData from "form-data"
const pinataJwtKey = process.env.VUE_APP_PINATA_JWT_KEY

export function uploadFile (val) { 
  const options = {
    pinataMetadata: {
      name: `${val.title}`
    },
    pinataOptions: {
      cidVersion: 0
    }
  }

  return new Promise((resolve, reject) => {
    const data = new NodeFormData();
    data.append("file", val.file);

    const endpoint = process.env.VUE_APP_PINATA_ENDPOINT

    if (options) {
      if (options.pinataMetadata) {
        data.append("pinataMetadata", JSON.stringify(options.pinataMetadata));
      }
      if (options.pinataOptions) {
        data.append("pinataOptions", JSON.stringify(options.pinataOptions));
      }
    }

    console.log("uploading..")

    axios.post(
      endpoint,
      data,
      {
        withCredentials: true,
        maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        maxBodyLength: "Infinity",
        headers: {
          "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
          "authorization": `Bearer ${pinataJwtKey}`
        }
      }).then(function (result) {
      if (result.status !== 200) {
        reject(new Error(`unknown server response while pinning File to IPFS: ${result}`));
      }
      console.log("uploaded!")
      resolve(result.data);
    }).catch(function (error) {
      reject(error);
    });
  });
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
