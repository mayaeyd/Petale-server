//getAllGrowingPlants

export const getAllGrowingPlants = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching plants",
      error: error.message,
    });
  }
};
