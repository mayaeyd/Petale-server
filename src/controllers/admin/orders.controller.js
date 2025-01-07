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
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
