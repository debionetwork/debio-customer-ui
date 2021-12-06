export async function errorHandler(err) {
  let error 

  switch (err) {
  case "1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low":
    error = {
      title: "Insufficient Balance",
      message: "Your transaction cannot succeed due to insufficient balance, check your account balance"
    }
    break;
  case "Unable to decode using the supplied passphrase":
    error = {
      title: "Incorrect Password",
      message: "Your password is not correct, please try again ! "
    }
    break;
  case "MetaMask Tx Signature: User denied transaction signature.":
    error = {
      title: "Transaction Rejected",
      message: "Metamask failed to proceed your transaction, confirm the transaction and make sure you are paying enough transaction weight!"
    }
    break;
  default : error = {
    title: "500",
    message: "Internal Server Error"
  }
    break
  }
  return error
}
