import User from "../models/user.model.js";

export const getOrders = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  try {
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

    return res
      .status(200)
      .send({ success: true, orders: user.purchaseHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

export const createOrder = async (req, res) => {
  const userId = req.user._id;
  const { listingId, buyerAddress, quantity } = req.body;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }
  if (!listingId || !buyerAddress || !quantity) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const gardener = await User.findOne({
      "gardenerProfile.marketplaceListings._id": listingId,
    });

    if (!gardener) {
      return res
        .status(404)
        .send({ message: "Plant not found in marketplace" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

export const cancelOrder = async (req, res) => {};

export const trackOrder = async (req, res) => {};
