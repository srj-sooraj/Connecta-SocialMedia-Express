import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    description: { type: String, default: "" },
    // profilePic: { type: String},
    friends: [{type: mongoose.Schema.Types.ObjectId,ref: "user"}],
    requests: [{type: mongoose.Schema.Types.ObjectId,ref: "user"}]
})

export default mongoose.model("user",userSchema)