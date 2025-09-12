"use client";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedSetUsername = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) return;

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        if (username.length < 6 || username.length > 18) {
          setUsernameMessage("Username must be between 6 and 18 characters");
          return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          setUsernameMessage(
            "Username can only contain letters, numbers, and underscores"
          );
          return;
        }

        const response = await axios.get(
          `/api/usernameCheck?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameMessage("Error checking username");
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<{ message: string }>(
        "/api/signup",
        data
      );

      toast.success("Sign Up Successful", {
        description: response.data.message,
      });

      router.replace(`/verifyCode/${data.username}`);
    } catch (error) {
      console.error("Error during sign-up:", error);
      toast.error("Sign Up Failed", {
        description: "There was a problem with your sign-up. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md space-y-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-500">Enter your details to sign up</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter username"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      debouncedSetUsername(e.target.value);
                    }}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {isCheckingUsername && (
                  <p className="text-sm text-gray-500">Checking username...</p>
                )}
                {usernameMessage && (
                  <p className="text-sm text-gray-500">{usernameMessage}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Create a password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
