import User from "../models/user.model.js";
//   const orderId = req.params.id;
//   const userId = req.user._id;

//   if (!userId) {
//     return res.status(400).send({ message: "User ID is required" });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     if (orderId) {
//       const order = user.purchaseHistory.find(
//         (order) => order.listingId === orderId
//       );
//       return res.status(200).send({ success: true, order });
//     }

//     return res
//       .status(200)
//       .send({ success: true, orders: user.purchaseHistory });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server error" });
//   }
// };

// export const createOrder = async (req, res) => {
//   const userId = req.user._id;
//   const { listingId, buyerAddress, quantity } = req.body;

//   if (!userId) {
//     return res.status(400).send({ message: "User ID is required" });
//   }
//   if (!listingId || !buyerAddress || !quantity) {
//     return res.status(400).send({ message: "All fields are required" });
//   }

//   try {
//     const gardener = await User.findOne({
//       "gardenerProfile.marketplaceListings._id": listingId,
//     });

//     if (!gardener) {
//       return res
//         .status(404)
//         .send({ message: "Plant not found in marketplace" });
//     }

//     const listing = gardener.gardenerProfile.marketplaceListings.find(
//       (item) => item._id.toString() === listingId
//     );

//     if (!listing) {
//       return res.status(404).send({ message: "Listing not found" });
//     }

//     if (listing.quantity < quantity) {
//       return res.status(400).send({ message: "Insufficient stock" });
//     }

//     listing.quantity -= quantity;
//     await gardener.save();

//     const order = {
//       listingId,
//       purchaseDate: new Date(),
//       quantity,
//       totalPrice: listing.price * quantity,
//       sellerGardenerId: gardener._id,
//       buyerAddress,
//     };

//     const user = await User.updateOne(
//       { _id: userId },
//       { $push: { purchaseHistory: order } }
//     );

//     res.status(201).send({
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({ message: "Server Error" });
//   }
// };

// export const cancelOrder = async (req, res) => {};

// export const trackOrder = async (req, res) => {};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { orderItems, totalAmount, deliveryAddress, deliveryMethod } =
      req.body;

    if (!userId || !orderItems || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newOrder = {
      orderItems: orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      deliveryAddress,
      status: "pending",
      orderDate: new Date(),
    };

    user.orders.push(newOrder);
    await user.save();

    const gardenerNotifications = [];
    for (const item of orderItems) {
      const gardener = await User.findOne({
        "gardenerProfile.marketplaceListings._id": item.id,
      });

      if (gardener) {
        const listing = gardener.gardenerProfile.marketplaceListings.id(
          item.id
        );
        if (listing) {
          gardener.gardenerProfile.orders =
            gardener.gardenerProfile.orders || [];
          gardener.gardenerProfile.orders.push({
            buyerId: userId,
            name: listing.plantName || item.name,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
            deliveryAddress,
            orderDate: new Date(),
          });

          await gardener.save();
        }
      }
    }

    res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
      gardenerNotifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order.",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders.", error: error.message });
  }
};

export const getGardenerOrders = async (req, res) => {
  try {
    const { gardenerId } = req.params;

    const gardener = await User.findById(gardenerId);
    if (!gardener || !gardener.gardenerProfile) {
      return res.status(404).json({ message: "Gardener not found." });
    }

    res.status(200).json({ orders: gardener.gardenerProfile.orders || [] });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching gardener orders.",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const order = user.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status || order.status;
    await user.save();

    res.status(200).json({ message: "Order status updated.", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status.", error: error.message });
  }
};
