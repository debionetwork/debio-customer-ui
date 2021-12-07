import axios from "axios";

export const submitRatingOrder = async (labId, serviceId, orderId, ratingBy, rating, review) => {
  const { data } = await axios.post(`${process.env.VUE_APP_BACKEND_API}rating`, {
    lab_id: labId,
    service_id: serviceId,
    order_id: orderId,
    rating_by: ratingBy,
    rating: rating,
    review: review
  });

  return data;
}

export const getRatingByOrderId = async (orderId) => {
  const { data: { data } } = await axios.get(`${process.env.VUE_APP_BACKEND_API}rating/order/${orderId}`);

  return data;
}

export const getRatingService = async (id) => {
  const { data } = await axios.get(`${process.env.VUE_APP_BACKEND_API}rating/service/${id}`);

  return data;
}
