import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";
import VerificationEmail from "../../emails/emailVerificationTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "AnonFeedback | Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: "Verification email is sent successfully",
    };
  } catch (emailError) {
    console.log("Error sending verification email ..", emailError);
    return {
      success: false,
      message: "failed to send the verification email...",
    };
  }
}
