"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
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
import { signInSchema } from "@/schemas/signInSchema";

type SigninFormData = z.infer<typeof signInSchema>;

export default function SigninPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        identifier:data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Sign in Failed", {
          description: result.error,
        });
      } else {
        toast.success("Sign in Successful");
        router.replace("/");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Sign in Failed", {
        description: "There was a problem with your sign-in. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md space-y-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Login to your Account</h1>
        <p className="text-gray-500">Enter your details to Login</p>
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email or username"
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
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Loggin in..." : "Log in"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
