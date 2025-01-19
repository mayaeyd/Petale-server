import User from "../../models/user.model.js";

export const getAllGardenersOrders = async (req, res) => {
  try {
    const gardeners = await User.find({
      gardenerProfile: { $exists: true },
      "gardenerProfile.orders": { $exists: true, $ne: [] },
    });

    const buyerPromises = gardeners.flatMap((gardener) =>
      gardener.gardenerProfile.orders.map((order) =>
        User.findById(order.buyerId).select("firstName lastName email")
      )
    );
    const buyers = await Promise.all(buyerPromises);

    const buyerMap = new Map(
      buyers.map((buyer) => [buyer?._id.toString(), buyer])
    );

    const allOrders = gardeners.map((gardener) => ({
      gardenerId: gardener._id,
      gardenerName: gardener.firstName + " " + gardener.lastName,
      gardenName: gardener.gardenerProfile.garden?.name,
      orders: gardener.gardenerProfile.orders.map((order) => {
        const buyer = buyerMap.get(order.buyerId.toString());
        return {
          ...order.toObject(),
          gardenerName: gardener.firstName + " " + gardener.lastName,
          gardenName: gardener.gardenerProfile.garden?.name,
          buyerInfo: buyer
            ? {
                name: `${buyer.firstName} ${buyer.lastName}`,
                email: buyer.email,
              }
            : null,
        };
      }),
    }));

    res.status(200).json({
      success: true,
      orders: allOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all gardeners' orders.",
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
