import User from "../models/user.model.js";

export const getOrders = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  if (orderId) {
    const order = user.purchaseHistory.find(
      (order) => order.listingId === orderId
    );
    return res.status(200).send({ success: true, order });
  }

  return res.status(200).send({ success: true, orders: user.purchaseHistory });
};

export const createOrder = async (req, res) => {};

export const cancelOrder = async (req, res) => {};

export const trackOrder = async (req, res) => {};
