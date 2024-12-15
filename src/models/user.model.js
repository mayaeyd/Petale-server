import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "gardener"],
      default: "user",
    },
    gardenerProfile: {
      garden: {
        name: {
          type: String,
          default: null,
        },
        location: {
          type: String,
          default: null,
        },
        plants: [
          {
            plantType: {
              type: String,
              enum: ["plant", "flower"],
              required: true,
            },
            scientificName: {
              type: String,
              required: true,
            },
            plantedDate: {
              type: Date,
              required: true,
            },
            sensorData: {
              currentMoisture: {
                type: Number,
                required: true,
              },
              currentHumidity: {
                type: Number,
                required: true,
              },
              currentTemperature: {
                type: Number,
                required: true,
              },
              lastUpdated: {
                type: Date,
                default: Date.now,
              },
            },
            wateringSchedule: {
              type:{
                frequency: {
                  type: String,
                  enum: ["daily", "weekly"],
                  default: "weekly",
                },
                nextWateringTime: {
                  type: Date,
                  default: Date.now,
                },
                isAutomatedWatering: {
                  type: Boolean,
                  default: false,
                },
                default: {},
              }
            },
          },
        ],
      },
      marketplaceListings: [
        {
          plantName: {
            type: String,
            required: true,
          },
          harvestDate: {
            type: Date,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          images: {
            type: [String],
            default: [],
          },
          status: {
            type: String,
            enum: ["available", "sold"],
            default: "available",
          },
        },
      ],
      default: {},
    },

    purchaseHistory: [
      {
        listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        sellerGardenerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
