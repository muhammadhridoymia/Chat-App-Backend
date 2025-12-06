import User from "../models/user.js";

// Signup controller
export const signup = async (req, res) => {
    const { name, email, password, profilePic } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
        return res.json({ message: "User already exists" });
    }

    // Create user
    const user = new User({ name, email, password, profilePic });
    await user.save();
    res.json({ message: "Signup successful", user:{name, email, profilePic, _id: user._id} });
};

// Login controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.json({ message: "Incorrect password" });
    }

    res.json({ message: "Login successful", user });
};
//Recomondations
export const GetAlluser = async (req, res) => {
    const { _id } = req.params;
    console.log("User ID:",_id);
    try {
        const users = await User.find({_id: { $ne: _id }}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Find User
export const Finduser = async (req, res) => {
  const { gmail } = req.params;
 console.log(gmail)
  try {
    const user = await User.findOne({ email: gmail }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }

    res.status(200).json({ users: user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
