import mongoose,{ Document,  model, Schema } from "mongoose";

export interface user extends Document{
    username:string;
    email:string;
    password:string;
    isVerified:boolean;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessage:boolean;
    messages:Message[]
}

export interface Message extends Document{
    content:string;
    isCreatedAt:Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "message cannot be empty"],
  },
  isCreatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userSchema:Schema<user> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"enter valid email"]
 },
 password:{
    type:String,
    required:[true,"password is required"]
 },
 isVerified:{
    type:Boolean,
    default:false
 },
 verifyCode:String,
 verifyCodeExpiry: Date,
 isAcceptingMessage:{
    type:Boolean,
    default:true
 },
 messages:[messageSchema]
})



const User = (mongoose.models.User as mongoose.Model<user>)  || model<user>("User", userSchema);




export default User;