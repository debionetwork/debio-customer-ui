import {
  registeredBanner, //"0 0 182 135" size 185
  receivedBanner, //"-20 0 300 135" size 300
  wetworkBanner, //"-20 0 300 150" size 295
  resultReadyBanner, //"-20 0 300 150" size 295
  qualityControlBanner, //"-20 0 300 125" size 295
  rejectedQCBanner
} from "@debionetwork/ui-icons"

export const PAYMENT_STATUS_DETAIL = [
  {
    status: "UNPAID",
    color: "#FAAD15"
  },
  {
    status: "PAID",
    color: "#52C41B"
  },
  {
    status: "CANCELLED",
    color: "#F5222D"
  },
  {
    status: "REFUNDED",
    color: "#F006CB"
  },
  {
    status: "FULFILLED",
    color: "#5640A5"
  }
]

export const ORDER_STATUS_DETAIL = (amount) => [
  {
    status: "REGISTERED",
    display: "Registered",
    color: "#52C41B",
    description: "Your request has been registered. You may send your sample to selected lab.",
    banner: registeredBanner,
    bannerSize: "185",
    viewBox: "-10 -13 182 182",
    e1: 2
  },
  {
    status: "ARRIVED",
    display: "Received by Lab",
    color: "#6F4CEC",
    description: "Your chosen lab has received and confirmed your specimen. The lab will soon process your order.",
    banner: receivedBanner,
    bannerSize: "300",
    viewBox: "-18 -20 295 295",
    e1: 3
  },
  {
    status: "QUALITYCONTROLLED",
    display: "Quality Controlled",
    color: "#F5222D",
    description: "Your specimen is now being examined by the lab to see if it is sufficient enough to be analyzed in the next phase. The lab will perform several procedures such as examine the visual of your specimen, do extraction and amplification of your DNA.",
    banner: qualityControlBanner,
    bannerSize: 295,
    viewBox: "-18 -15 275 275",
    e1: 4
  },
  {
    status: "REJECTED",
    display: "Rejected",
    color: "#FAAD15",
    description: `Your sample has failed quality control. Your service fee of ${amount} DAI will be refunded to your account.`,
    banner: rejectedQCBanner,
    bannerSize: 295,
    viewBox: "-15 -5 260 260",
    e1: 4
  },
  {
    status: "WETWORK",
    display: "Analyzed",
    color: "#F006CB",
    description: "The lab is now analyzing your specimen.",
    banner: wetworkBanner,
    bannerSize: 295,
    viewBox: "-15 -5 285 285",
    e1: 5
  },
  {
    status: "RESULTREADY",
    display: "Result Ready",
    color: "#5640A5",
    description: "Thank you for your patience. Your order has been fulfilled. You can click on this button below to see your result.",
    banner: resultReadyBanner,
    bannerSize: 295,
    viewBox: "-5 -5 295 295",
    e1: 6
  }
]

export const STAKE_STATUS_DETAIL = [
  {
    status: "OPEN",
    display: "Staked",
    color: "#F006CB"
  },
  {
    status: "CLAIMED",
    display: "Service Available",
    color: "#5640A5"
  },
  {
    status: "PROCESSED",
    display: "Request Test",
    color: "#4CBB65"
  },
  {
    status: "WAITINGFORUNSTAKED",
    display: "Waiting For Unstaked",
    color: "#FAAD15"
  },
  {
    status: "UNSTAKED",
    display: "Unstaked",
    color: "#E32319"
  }
]
