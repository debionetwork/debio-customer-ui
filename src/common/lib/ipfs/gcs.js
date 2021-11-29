import axios from 'axios'

export async function getSignedUrl(fileName, action = 'read') {
  const { data: signedUrl } = await axios.get(`${process.env.VUE_APP_BACKEND_API}gcs/signed_url`, {
    params: {
      filename: fileName,
      action: action
    }
  })

  return signedUrl
}

export async function createSyncEvent(fileName) {
  const { data } = await axios.post(`${process.env.VUE_APP_BACKEND_API}gcs/create_sync_event`, { filename: fileName })

  return data
}
