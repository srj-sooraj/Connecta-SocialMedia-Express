import userSchema from "./models/User.model.js";
import nodemailer from "nodemailer";
import userSchemaNew from './models/signup.model.js'
import bcrypt from "bcrypt"
import pkg from 'jsonwebtoken'
const{sign}=pkg 
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9385434273c19d",
    pass: "025fbcd0b91b38",
  },
});

export async function registerEmail(req,res) {
  try {
    const {email} = req.body;
    
    const otp = Math.round(Math.random() * 1000000);
    console.log(email, otp ,'-----------------');
    
    await userSchema.create({ email, otp });
    const info = await transport.sendMail({
      from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
      to: `${email}`,
      subject: "OTP",
      text: `Your otp for completing registration is ${otp}.`, // Plain-text version of the message
    });

    console.log("Message sent:", info.messageId);

    return res.status(201).json({msg:'Mail sent successfully',email,ok:true})
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ msg: "Internal server error" ,ok:false});
  }
}

export async function verifyOtp(req,res) {
 try {
  const {email,otp} = req.body;
  const user = await userSchema.findOne({email,otp});
console.log(email);

  if(!user){
    console.log('jhjh');
    
    return res.status(400).json({ ok: false, msg: "Email not found" });
  }
  
  if (user.otp != otp) {
      await userSchema.deleteOne({ email });
      return res.status(400).json({ ok: false, msg: "Invalid OTP" });
    }

     return res.status(200).json({ ok: true, msg: "OTP verified successfully" });

 } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false });
 }
}



export async function signup(req,res) {
    try {
        const {username,password,cpassword,description} = req.body;
        const { email } = req.body;
        console.log(username,password);
        
        
        if(!(username&&password&&cpassword))
            return res.status(400).json({msg:'All fields are required',ok:false})
        
        const user = await userSchemaNew.findOne({username})
        if(user)
            return res.status(400).json({msg:'user already exists!',ok:false}) 

        if(cpassword!==password)
             return res.status(400).json({msg:'password mismatch',ok:false})

        const emailUser = await userSchema.findOne({ email });
        if(!emailUser)
            return res.status(400).json({msg:'email not verified',ok:false});


        const hashedpsd =await bcrypt.hash(password,10)
        console.log(hashedpsd);
        const data = await userSchemaNew.create({username,password:hashedpsd,description})

        emailUser.username = username;
        emailUser.password = hashedpsd;
        await emailUser.save();

        return res.status(201).json({msg:'registered',ok:true})
        
    } catch (error) {
        return res.status(500).json({msg:'internal server error',ok:false})
    }
}


export async function signin(req,res) {
    try {
        const {username,password} = req.body;
        console.log(username,password);
        
        
        if(!(username&&password))
            return res.status(400).json({msg:'All fields are required',ok:false})
        
        const user = await userSchemaNew.findOne({username})
        if(!user)
            return res.status(400).json({msg:'username does not  exists!',ok:false}) 

        const isEqual = await bcrypt.compare(password, user.password)
        
        if(!isEqual)
            return res.status(400).json({msg:'Invalid credentials'})

        const token = await sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
        console.log(token);
        return res.status(201).json({msg:'success',ok:true,token})

        // return res.status(201).json({msg:'success',ok:true})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:'internal server error',ok:false})
    }
}
// export async function addDetails(req,res) {
//     try {
//         const {profilePic} = req.body;
//         const profile = req.file.filename;
//         console.log(profile);
//         const data = await userSchemaNew.create({profilePic})
//         console.log(data);
        
//          return res.status(200).json({msg:'success',ok:true},profile)
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({msg:'internal server error',ok:false})
        
//     }
// }

export async function getAllUsers(req, res) {
    try {
        const { userId } = req.user;

        const users = await userSchemaNew.find(
            { _id: { $ne: userId } },
            { password: 0 }
        );

        return res.status(200).json({ ok: true, users });
    } catch (err) {
        return res.status(500).json({ ok: false });
    }
}

export async function getRequests(req, res) {
  const user = await userSchemaNew
    .findById(req.user.userId)
    .populate("requests", "username profilePic");

  res.json({ ok: true, requests: user.requests });
}


export async function sendRequest(req, res) {
    try {
        const { toUserId } = req.body;
        const { userId } = req.user;

        const toUser = await userSchemaNew.findById(toUserId);

        if (!toUser)
            return res.status(400).json({ ok: false, msg: "User not found" });

        if (toUser.requests.includes(userId))
            return res.status(400).json({ ok: false });

        toUser.requests.push(userId);
        await toUser.save();

        return res.status(200).json({ ok: true, msg: "Request sent" });

    } catch (err) {
        return res.status(500).json({ ok: false });
    }
}


export async function acceptRequest(req, res) {
    try {
        const { fromUserId } = req.body;
        const { userId } = req.user;

        const user = await userSchemaNew.findById(userId);
        const fromUser = await userSchemaNew.findById(fromUserId);

        user.requests = user.requests.filter(
            id => id.toString() !== fromUserId
        );

        user.friends.push(fromUserId);
        fromUser.friends.push(userId);

        await user.save();
        await fromUser.save();

        return res.status(200).json({ ok: true });

    } catch (err) {
        return res.status(500).json({ ok: false });
    }
}

export async function getMe(req, res) {
  const user = await userSchemaNew
    .findById(req.user.userId)
    .select("-password");

  res.json({ ok: true, user });
}


export async function updateProfile(req, res) {
  const { username, description } = req.body;

  const user = await userSchemaNew.findByIdAndUpdate(
    req.user.userId,
    { username, description },
    { new: true }
  ).select("-password");

  res.json({ ok: true, user });
}


export async function getFriends(req, res) {
  const user = await userSchemaNew
    .findById(req.user.userId)
    .populate("friends", "username description profilePic");

  res.json({ ok: true, friends: user.friends,description:user.description });
}