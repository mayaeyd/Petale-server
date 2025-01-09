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

    const totalOrders = users.reduce(
      (total, user) => total + user.purchaseHistory.length,
      0
    );

    res.status(200).send({
      success: true,
      count: totalOrders,
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

export const getAllSales = async (req, res) => {
  let totalSales = 0;
  try {
    const users = await User.find(
      { role: "gardener" },
      "firstName lastName email gardenerProfile.marketplaceListings"
    );

    const salesData = users.map((user) => {
      totalSales += user.gardenerProfile.marketplaceListings.filter(
        (listing) => listing.status === "sold"
      ).length;

      const totalGardenerSales =
        user.gardenerProfile.marketplaceListings.filter(
          (listing) => listing.status === "sold"
        ).length;

      const totalRevenue = user.gardenerProfile.marketplaceListings
        .filter((listing) => listing.status === "sold")
        .reduce((acc, listing) => acc + listing.price * listing.quantity, 0);

      return {
        gardenerId: user._id,
        gardenerName: `${user.firstName} ${user.lastName}`,
        gardenerEmail: user.email,
        totalGardenerSales,
        totalRevenue,
        listings: user.gardenerProfile.marketplaceListings.filter(
          (listing) => listing.status === "sold"
        ),
      };
    });

    res.status(200).send({
      success: true,
      count: totalSales,
      data: salesData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching sales",
      error: error.message,
    });
  }
};
