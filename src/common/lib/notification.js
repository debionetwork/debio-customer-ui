import localStorage from "@/common/lib/local-storage"
import { getNotification } from "@/common/lib/api/customer/notification"
// import store from "@/store"

// const routes = {
//   "New Order": "lab-dashboard-process-order",
//   "Add service": "lab-dashboard-services-detail"
// }

export async function getUnlistedNotification (role, newBlock, lastBlock) {
  const from = "Debio Network"
  const address = localStorage.getAddress()

  const { data } = await getNotification(address, lastBlock, newBlock, role, from)
  console.log("data", data)
  const storageName = "LOCAL_NOTIFICATION_BY_ADDRESS_" + address + "_" + role;

  let listNotification = []
  const listNotificationJson = localStorage.getLocalStorageByName(storageName);
  if (listNotificationJson) {
    listNotification = JSON.parse(listNotificationJson)    
  }
  
  data.forEach(event => {
    console.log(event.entity)
    if(lastBlock !== parseInt(event.block_number)){
      const dateSet = new Date(event.created_at)
      const timestamp = dateSet.getTime().toString()
      const notifDate = dateSet.toLocaleString("en-US", {
        weekday: "short", // long, short, narrow
        day: "numeric", // numeric, 2-digit
        year: "numeric", // numeric, 2-digit
        month: "long", // numeric, 2-digit, long, short, narrow
        hour: "numeric", // numeric, 2-digit
        minute: "numeric"
      });
  
      const message = event.description.replace("[]", event.reference_id)
      
      listNotification.push({
        message,
        timestamp,
        route: "",
        // route: routes[event.entity],
        params: event.reference_id,
        block: event.block_number,
        read: false,
        notifDate
      })
  
    }
  });
}
