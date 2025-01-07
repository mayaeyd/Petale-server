//getAllOrders
//getAllSales

import User from "../../models/user.model.js";

export const getOrders = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const user = await User.findOne(
        { "purchaseHistory._id": id },
        "firstName lastName email purchaseHistory.$"
      ).populate(
        "purchaseHistory.sellerGardenerId",
        "firstName lastName email"
      );

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Order not found",
        });
      }

      const order = user.purchaseHistory[0];
      return res.status(200).send({
        success: true,
        data: {
          buyerId: user._id,
          buyerName: `${user.firstName} ${user.lastName}`,
          buyerEmail: user.email,
          order,
        },
      });
    }

    const users = await User.find(
      { purchaseHistory: { $exists: true, $ne: [] } },
      "firstName lastName email purchaseHistory"
    ).populate("purchaseHistory.sellerGardenerId", "firstName lastName email");

    const allOrders = users.map((user) => ({
      buyerId: user._id,
      buyerName: `${user.firstName} ${user.lastName}`,
      buyerEmail: user.email,
      orders: user.purchaseHistory,
    }));

    res.status(200).json({
      success: true,
      count: allOrders.length,
      data: allOrders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
