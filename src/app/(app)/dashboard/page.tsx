"use client";
import { CircleUser } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="bg-blue-900 w-full h-screen flex flex-col gap-3 justify-center items-center">
      <div className="  bg-green-800 text-shadow-cyan-200 text-2xl p-4 border-2 text-cyan-500 border-fuchsia-500">
        <h1>Welcome Back Human</h1>
        <CircleUser />
        <h1>How are you today ?</h1>
      </div>
    </div>
  );
}
