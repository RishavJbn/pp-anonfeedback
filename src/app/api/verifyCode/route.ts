import connectDb from "@/db/dbConfig";
import User from "@/models/user.model";

export async function POST(req: Request) {
  await connectDb();

  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          message: "User not found . Anauthorized request",
          success: false,
        },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeValidtime = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeValidtime) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          message: "Account verified successfully",
          success: true,
        },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          message: "Verify code is incorred . Enter the correct code..",
          success: true,
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          message:
            "Verification code is expired . Please sign up again to get new verification code",
          success: true,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "failed verify code ",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
