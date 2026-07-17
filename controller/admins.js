const adminModel = require('../models/admins');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.addAdmin = async (req , res) => {
    const {name, username, email, password, phone} = req.body;
    

    const hashedPassword = await bcrypt.hash(password,10);

    const newAdmin = await adminModel.create({
        name,
        username,
        email, 
        phone,
        password: hashedPassword, 
    });

    console.log(newAdmin);

    const accessToken = jwt.sign({id: newAdmin._id}, process.env.JWT_SECRET, {expiresIn: '10 day'});

    return res.json({newAdmin, accessToken});

        
}

exports.login = async (req, res) => {

    const {identifier, password} = req.body;     // identifier -> phone, email

    const isExistAdmin = await adminModel.findOne({
        $or: [{ email: identifier }, { phone : identifier }]
    }).select('password'); 


    if (!isExistAdmin) {
        return res.status(403).json({message: "Admin not found with this phone or email !"});
    }
    
    const isPasswordValid = bcrypt.compare(isExistAdmin.password, password);

    if (!isPasswordValid) {
        return res.status(400).json("Password is not valid !");
    }

    const accessToken = jwt.sign({id: isExistAdmin._id}, process.env.JWT_SECRET, { expiresIn : "10 day"} );

    return res.json(accessToken);
    
}

exports.updateAdmin = async (req, res) => {
    const {name, username, email, password, phone} = req.body;

    const hashedPassword = await bcrypt.hash(password, process.env.JWT_SECRET);

    const updatedAdmin = await adminModel.findByIdAndUpdate({
        _id: req.user._id,
    }, {
      name,
      username,
      email,
      password: hashedPassword,
      phone  
    }).select('password');

    return res.json(updatedAdmin);
    


}




// token razie
/*
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDg2ZWY1NWQ3ZjczODY0NTJkMzRlMyIsImlhdCI6MTc4MTg0OTIwMywiZXhwIjoxNzgyNzEzMjAzfQ.r5P78qYTZkO3Niq2iV3u4ZNstydA_r3OkyBRMsL6UNA"
*/