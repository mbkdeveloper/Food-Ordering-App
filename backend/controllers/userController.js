import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// login user

const loginUser = async (req,res)=>{

    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }

        const token = createToken(user._id, user.role);
        res.json({success:true,token, role:user.role});


    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }

}

const createToken = (id, role)=>{
    return jwt.sign({id, role},process.env.JWT_SECRET)
}


// register user

const registerUser = async (req,res)=>{
   const {name,password,email,role}= req.body;
   try {
    // checking is user already exist
    const exists = await userModel.findOne({email});
    if (exists) {
        return res.json({success:false,message:"User already exists"}); 
    }
    // Validating email format & Strong password

    if (!validator.isEmail(email)) {
        return res.json({success:false,message:"Please enter a Valid email"}); 
    }

    if (password.length<8) {
        return res.json({success:false,message:"Please enter a Strong Password"}); 
    }

    // hashing user password

    const salt =await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new userModel({
        name:name,
        email:email,
        password:hashedPassword,
        role: role || 'client'
    })

   const user= await newUser.save();
   const token = createToken(user._id, user.role);

   res.json({success:true,token, role: user.role});

   } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
   }
}

// list all users
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching users" });
    }
};

// delete a user
const deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting user" });
    }
};

// update a user (name, role, password)
const updateUser = async (req, res) => {
    try {
        const { id, name, role, password } = req.body;
        let updateData = { name, role };
        
        if (password && password.length >= 8) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await userModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating user" });
    }
};

// get admin dashboard stats
const getAdminStats = async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        const foodCount = await foodModel.countDocuments();
        const orderCount = await orderModel.countDocuments();
        
        const orders = await orderModel.find({});
        let totalRevenue = 0;
        orders.forEach(order => {
            if (order.status === 'Delivered') {
                totalRevenue += order.amount;
            }
        });

        res.json({
            success: true,
            data: {
                users: userCount,
                foods: foodCount,
                orders: orderCount,
                revenue: totalRevenue
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching stats" });
    }
};

export { loginUser, registerUser, listUsers, deleteUser, updateUser, getAdminStats };