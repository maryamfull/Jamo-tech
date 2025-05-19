import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ENV_VARS } from "./constant";
import { User } from "./models/user.model";
import Product from "./models/product.model";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Order } from "./models/order.schema";
import { Feebackss } from "./models/feedback.schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use("/temp", express.static(path.join(__dirname, "temp")));
app.use(
  cors({
    origin: ENV_VARS.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

mongoose
  .connect(process.env.MONGO_URI || ENV_VARS.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "temp"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/login", async (req, res) => {
  // get data from req.body
  const { password, username } = req.body;
  try {
    // username or email
    if (!username) {
      return res.status(400).json({ message: "username  is required" });
    }

    // find the user
    const userDB = await User.findOne({
      $or: [{ username }],
    });
    if (!userDB) {
      return res.status(400).json({ message: "user does not exist" });
    }

    if (password !== userDB.password) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const loggedInUser = await User.findById(userDB._id).select("-password");
    res
      .status(200)
      .json({
        user: loggedInUser,
        login: true,
        message: "User logged In Successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in", login: false, error: err.message });
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password, userType } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  // validation - not empty
  if (
    [username, email, password, userType].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json({ message: "All fields are Required" });
  }

  // check if user already exists: username,email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res.status(400).json({ message: "User already exist" });
  }

  // create user object - create entry in db
  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
    userType,
  });

  // remove password  field from response
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return res
      .status(500)
      .json({ message: "Something went wrong while registering the user" });
  }

  return res
    .status(201)
    .json({
      user: createdUser,
      register: true,
      message: "User registered successfully",
    });
});

app.post("/add-Product", upload.single("image"), async (req, res) => {
  try {
    const { title, price, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const encodedFilename = encodeURIComponent(req.file.filename);
    const imageUrl = `http://localhost:8000/temp/${encodedFilename}`;

    // Create new Product
    const newProduct = new Product({
      image: imageUrl,
      contentType: req.file.mimetype,
      title,
      price,
      description,
    });
    await newProduct.save();

    res
      .status(200)
      .json({ message: "Product added successfully", Product: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding Product", error: err.message });
  }
});

app.get("/get-all-products", async (req, res) => {
  const Products = await Product.find();
  return res.status(200).json({ data: Products, status: true });
});

// Route to handle product purchase
app.post("/buy", async (req, res) => {
  const { userId, products } = req.body; // { userId, products: [{productId, quantity}, ...], shippingAddress }

  try {
    // Fetch user from database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalAmount = 0;
    const productDetails = [];

    // Process each product in the purchase
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });

      // Calculate the total amount (product price * quantity)
      totalAmount += product.price * item.quantity;

      // Store product details to use in the order
      productDetails.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // Create an order
    const order = new Order({
      user: user._id,
      products: productDetails,
      totalAmount,
    });

    await order.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while processing your order" });
  }
});

app.post("/product/:productId/react", async (req, res) => {
  const { productId } = req.params;
  const { userId, type } = req.body; // type: "like" or "dislike"

  if (!["like", "dislike"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Invalid type. Must be 'like' or 'dislike'." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyLiked = product.likes.includes(userId);
    const alreadyDisliked = product.dislikes.includes(userId);

    if (type === "like") {
      if (alreadyLiked) {
        product.likes.pull(userId); // remove like (toggle)
      } else {
        product.likes.addToSet(userId); // add like
        product.dislikes.pull(userId); // ensure dislike is removed
      }
    } else if (type === "dislike") {
      if (alreadyDisliked) {
        product.dislikes.pull(userId); // remove dislike (toggle)
      } else {
        product.dislikes.addToSet(userId); // add dislike
        product.likes.pull(userId); // ensure like is removed
      }
    }

    await product.save();

    return res.status(200).json({
      message: `${type === "like" ? "Like" : "Dislike"} updated`,
      likes: product.likes.length,
      dislikes: product.dislikes.length,
      status: "success",
    });
  } catch (error) {
    console.log("err", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: "fail" });
  }
});

app.post("/product/:productId/feedback", async (req, res) => {
  const { productId } = req.params;
  const { userId, comment } = req.body;

  if (!comment || !userId) {
    return res.status(400).json({ message: "userId and comment are required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.feedbacks.push({ user: userId, comment });

    await product.save();

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedbacks: product.feedbacks,
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/feedback/:productId
app.get("/feedback/:productId", async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(productId)
      .populate({
        path: "feedbacks.user",
        select: "username email",
      })
      .populate("likes", "username")
      .populate("dislikes", "username");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ product, status: true });
  } catch (error) {
    return res.status(500).json({ error: "Server error", status: false });
  }
});

// ----------------------------------------------
// Admin Routes
// GET all customers (users with userType "User")
app.get("/manage-orders", async (req, res) => {
  try {
    // Fetch all users with userType 'User' and populate their boughtProduct
    const customers = await User.find({ userType: "User" })
      .populate("boughtProduct") // Populate the 'boughtProduct' field with product details
      .exec();

    // Return the customers' data
    res.status(200).json({
      message: "Customers retrieved successfully",
      customers: customers.map((customer) => ({
        id: customer._id,
        username: customer.username,
        email: customer.email,
        boughtProducts: customer.boughtProduct, // List of bought products with details
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/update-order-details/:id admin
app.put("/update-order-details/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    // Only allow updating username and email
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(username && { username }),
        ...(email && { email }),
      },
      { new: true, runValidators: true }
    ).select("username email");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Order details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/delete-order/:userId
app.delete("/delete-order/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User and order details deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders, return a single array of products and calculate totalAmount
app.get("/orders", async (req, res) => {
  try {
    // Fetch all orders and only select the 'products' field
    const orders = await Order.find()
      .select("products") // Only return the 'products' field
      .populate("products.product") // Populate product details in the order
      .exec();

    // Flatten all orders into a single array of products
    const allProducts = orders.flatMap((order) => order.products);

    // Calculate totalAmount dynamically by summing product quantity * priceAtPurchase for each product
    const totalAmount = allProducts.reduce((sum, item) => {
      return sum + item.quantity * item.priceAtPurchase;
    }, 0);

    // Return the combined products array and the calculated totalAmount
    return res.status(200).json({
      products: allProducts, // All products from all orders combined
      totalAmount: totalAmount, // Total amount calculated from all products
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching orders" });
  }
});

app.listen(ENV_VARS.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV_VARS.PORT}`);
});
