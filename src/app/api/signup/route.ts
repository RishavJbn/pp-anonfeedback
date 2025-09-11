import connectDb from "@/db/dbConfig";
import { resendEmail } from "@/helpers/resend";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const { username, email, password } = await req.json();
    const isUser = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000);
    const otpcode = Math.floor(100000 + Math.random() * 900000).toString();
    if (isUser) {
      // user exist and is verified
      if (isUser.isVerified) {
        return NextResponse.json(
          { error: "User is already registered and verified ! " },
          { status: 401 }
        );
      }
      //   if user exist but not verified
      else {
        isUser.password = hashedPassword;
        isUser.username = username;
        isUser.email = email;
        isUser.verifyCode = otpcode;
        isUser.verifyCodeExpiry = expiryTime;
        await isUser.save();
      }
    }
    // user doesnt exists
    else {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode: otpcode,
        verifyCodeExpiry: expiryTime,
        isAcceptingMessage: true,
      });
      await newUser.save();
    }

    const emailResponse = await resendEmail(email, username, otpcode);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Verification email is sent successfully !",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error while registering user", error);
    return NextResponse.json(
      {
        message: "Error while registering user",
        success: false,
      },
      {
        status: 400,
      }
    );
}}
