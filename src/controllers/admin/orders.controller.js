//getAllOrders
//getAllSales

export const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
