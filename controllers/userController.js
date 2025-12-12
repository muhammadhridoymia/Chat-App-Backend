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
    console.log(email,password)

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    if (user.password !== password) {
        return res.json({ message: "Incorrect password" });
    }

    res.json({ message: "Login successful", user});
};

// Send Friends
export const SendFriends = async (req, res) => {
    const { userId } = req.params;
    console.log(userId)
    try {
        const user = await User.findById(userId).populate({
            path: "friends",
            select: "_id name isonline"
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//Recomondations
export const GetAlluser = async (req, res) => {
    const { _id } = req.params;
    console.log("User ID:",_id);
    try {
        const users = await User.find({_id: { $ne: _id }}).populate({select:"_id name isonline"});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Find Friend 
export const Finduser = async (req, res) => {
  const { gmail } = req.params;
  console.log("Searching for email:", gmail);
  
  try {
    const user = await User.findOne({ email: gmail })
        .select("_id name isonline profilePic email") 
        .exec();

    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }
    res.status(200).json({ user: user });

  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: error.message });
  }
};

//Send Friend Request 
export const FriendRequest = async (req, res) => {
    const { fromId, toId } = req.body;

    const user = await User.findById(toId);
    user.friendRequests.push({ fromUser: fromId });
    await user.save();

    res.json({ message: "Friend request sent" });
};


// Load Friends Request
export const LoadFriendsRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userid for load request",userId)
    const user = await User.findById(userId)
      .populate("friendRequests.fromUser", "name email profilePic");
    console.log(user.friendRequests)
    res.json(user.friendRequests);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Accept Friend Request
export const AcceptRequest = async (req, res) => {
    const { userId, requesterId } = req.body;

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    // Add each other as friends
    user.friends.push(requesterId);
    requester.friends.push(userId);

    // Remove the pending request
    user.friendRequests = user.friendRequests.filter(
        req => req.fromUser.toString() !== requesterId
    );

    await user.save();
    await requester.save();

    res.json({ message: "Accepted" });
};
