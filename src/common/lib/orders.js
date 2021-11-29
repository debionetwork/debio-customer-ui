import axios from "axios";
import localStorage from "@/common/lib/local-storage";

export async function fetchPaymentHistories(searchQuery) {
  const {
    data: {
      data
    }
  } = await axios.get(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/orders/list/${localStorage.getAddress()}`, {
    params: {
      size: 1000,
      page: 1,
      keyword: searchQuery || ""
    }
  });

  return data;
}

export async function fetchPaymentDetails(hash) {
  const {
    data
  } = await axios.get(
    `${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/orders/${hash}`
  );

  return data;
}

export async function fetchBountyLists(hash) {
  const { data: { data } } = await axios.get(
    `${process.env.VUE_APP_BACKEND_API}orders/bounty_list/${hash}`
  );

  return data;
}
