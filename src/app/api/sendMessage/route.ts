import connectDb from "@/db/dbConfig";
import User, { Message } from "@/models/user.model";



export async function POST(req:Request){
    await connectDb()
    const {username,content} = await req.json();

    try {
         const user = await User.findOne({username});
        
         if(!user){
            return Response.json({message:"User not found",success:false},{status:404})
         }
         if(!user.isAcceptingMessage){
                return Response.json({message:"User is not accepting message",success:false},{status:403})
         }
       const newMessage = { content, isCreatedAt: new Date() };
       user.messages.push(newMessage as Message);
       await user.save();

           return Response.json({message:"Message sent successfully",success:true},{status:201});



    } catch (error) {
        console.error("Error sending message",error)
           return Response.json({message:"Error while sending message",success:false},{status:500}) 
    }
}