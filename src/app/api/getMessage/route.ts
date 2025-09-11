import connectDb from "@/db/dbConfig";
import { getServerSession, User as AuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/user.model";
import mongoose from "mongoose";

export async function GET() {
  await connectDb();

  const session = await getServerSession(authOptions);
  const user: AuthUser = session?.user;

  if (!user || !session) {
    return Response.json(
      {
        message: "User not authenticated",
        success: false,
      },
      { status: 401 }
    );
  }
  /**
   * Converts the authenticated user's `_id` string to a Mongoose `ObjectId` instance,
   * which is required for querying MongoDB collections using the user's identifier.
   */

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          message: "User not found ",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        messsages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occured getting message", error);
    return Response.json(
      {
        error: "Error occured while getting the messages",
        success: false,
      },
      { status: 500 }
    );
  }
}
