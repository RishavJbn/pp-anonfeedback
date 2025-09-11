import connectDb from "@/db/dbConfig";
import User from "@/models/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import z from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export  async function GET(req: Request) {
  await connectDb();

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      return Response.json(
        {
          message:
            "Username is not valid. Username can only contain numbers, alphabets, and underscores",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const isUserExist = await User.findOne({ username, isVerified:true});
    if (isUserExist) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        message: "Username is available !",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
