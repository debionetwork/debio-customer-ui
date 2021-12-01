export async function errorHandler(err) {
  let message 

  switch (err) {
  case "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low":
    message = "Your transaction cannot succeed due to insufficient balance, check your account balance"
    break;
  case "Unable to decode using the supplied passphrase":
    message = "Incorrect Password"
    break;
  default : message = "Internal Server Error"
    break
  }
  return message
}
