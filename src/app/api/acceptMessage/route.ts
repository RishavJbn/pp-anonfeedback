import connectDb from "@/db/dbConfig";
import { getServerSession, User as AuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/user.model";

export async function POST(req: Request) {
await  connectDb();
  try {
    const session = await getServerSession(authOptions);
    const user: AuthUser = session?.user;

    if (!user || !session) {
      return Response.json(
        {
          message: "User is not authenticated",
          success: false,
        },
        { status: 201 }
      );
    }
    const userId = user._id;
    const { acceptMessage } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          message: "User not found unable to update message accepting status",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        message: "Message accepting status updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating message accepting status", error);
    return Response.json(
      {
        message: "Error while updating message acceptance status",
      },
      { status: 500 }
    );
  }
}


export async function GET(){
    await connectDb();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!user || !session){
        return Response.json({
            message:"User not authenticated",
            success:false
        },{status:401})
    }
    try {
        const userExist = await User.findById(user._id);
        if(!userExist){
            return Response.json({
                message:"User not found ",
                success:false
            },{status:404})
        }

        return Response.json({
            success:true,
            isAcceptingMessage:userExist.isAcceptingMessage
        },{status:200})
    } catch (error) {
        console.error("Error getting user message accepting status",error);
        return Response.json({
            message:"error getting user message status ",
            success:false
        },{status:500})
    }
}