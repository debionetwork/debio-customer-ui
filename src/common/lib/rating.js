import axios from "axios";

export const submitRatingOrder = async (labId, serviceId, orderId, ratingBy, rating, created) => {
  const result = await axios.post(`${process.env.VUE_APP_DEV_DEBIO_BACKEND_URL}/rating`, {
    lab_id: labId,
    service_id: serviceId,
    order_id: orderId,
    rating_by: ratingBy,
    rating: rating,
    created: created
  });
  
  return result.data;
}
