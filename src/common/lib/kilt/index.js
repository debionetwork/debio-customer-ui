import * as Kilt from '@kiltprotocol/sdk-js'

// create and return a RequestForAttestation from claim
async function _requestFromClaim(
  lightDid,
  keystore,
  claim
) {
  const request = Kilt.RequestForAttestation.fromClaim(claim)
  await request.signWithDidKey(
    keystore,
    lightDid,
    lightDid.authenticationKey.id
  )

  return request
}

// TODO: Have to redefine this soon
export function getCtypeSchema() {
  return Kilt.CType.fromSchema({
    $schema: 'http://kilt-protocol.org/draft-01/ctype#',
    title: 'Drivers License',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'integer'
      }
    },
    type: 'object'
  })
}

export async function generateKeypairs(
  keystore,
  mnemonic
 ) {
  // signing keypair
  const signing = await keystore.generateKeypair({
    alg: Kilt.Did.SigningAlgorithms.Sr25519,
    seed: mnemonic
  })

  // encryption keypair
  const encryption = await keystore.generateKeypair({
    alg: Kilt.Did.EncryptionAlgorithms.NaclBox,
    seed: mnemonic
  })

  // build the keys object
  return {
    authenticationKey: {
      publicKey: signing.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    },
    encryptionKey: {
      publicKey: encryption.publicKey,
      type: Kilt.EncryptionKeyType.X25519
    }
  }
}

export async function generateLightDid(wss, mnemonic) {
  // init
  await Kilt.init(wss)

  // create secret and DID public keys
  const keystore = new Kilt.Did.DemoKeystore()
  const keys = await generateKeypairs(keystore, mnemonic)

  // create the DID
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })

  return {
    lightDid,
    mnemonic
  }
}

// create a Claim object from lightDid, ctype and given content
export function createClaim(
  lightDid,
  ctype,
  content,
) {
  const claim = Kilt.Claim.fromCTypeAndClaimContents(
    ctype,
    content,
    lightDid.did
  )

  return claim
}

export async function generateRequest(
  wss,
  mnemonic,
  claimAttributes
) {
  // init
  await Kilt.init(wss)

  const keystore = new Kilt.Did.DemoKeystore()
  const keys = await generateKeypairs(keystore, mnemonic)

  // create the DID
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })

  // create claim
  const ctype = getCtypeSchema()
  const claim = await createClaim(lightDid, ctype, claimAttributes)

  // create request
  return await _requestFromClaim(lightDid, keystore, claim)
}