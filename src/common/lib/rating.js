import axios from "axios";

export const submitRatingOrder = async (labId, serviceId, orderId, ratingBy, rating) => {
  const result = await axios.post(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/rating`, {
    lab_id: labId,
    service_id: serviceId,
    order_id: orderId,
    rating_by: ratingBy,
    rating: rating
  });
  
  return result.data;
}

export const getRatingByOrderId = async (orderId) => {
  const result = await axios.get(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/${orderId}`, {});

  return result.data;
}
