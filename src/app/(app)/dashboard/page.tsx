"use client";

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Message } from "@/models/user.model";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from "lucide-react";


export default function DashboardPage() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [isSwitchLoading, setisSwitchLoading] = useState(false);
  
  const { data: session } = useSession();
  

  const { register, setValue, watch } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const AcceptMessages = watch("AcceptMessages");



  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };



  const acceptMessageStatus  = useCallback(async ()=>{
    setisSwitchLoading(true);
    
    try {
      const response = await axios.get('/api/acceptMessage');
      setValue("AcceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "failed to fetch message status";
        toast.error(errorMessage);
    } finally{
      setisSwitchLoading(false)
    }
  },[setValue])



 const getAllMessages = useCallback(async (refresh: boolean = false) => {
   setisLoading(true);
   setisSwitchLoading(true);

  try {
    const response = await axios.get("api/getMessage");
    setMessages(response.data.messages || []);
    if (refresh) {
     toast.success("Showing Latest Message..");
    }
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    const errorMessage = axiosError.response?.data?.message || "failed to fetch messages";
    toast.error(errorMessage);
  } finally{
    setisLoading(false)
    setisSwitchLoading(false)
  }
 }, [setisLoading,setMessages]);



 useEffect(()=>{
  if(!session || !session.user) return;
  acceptMessageStatus();
  getAllMessages();
 },[session,setValue,acceptMessageStatus,getAllMessages])

 const switchToggle = async ()=>{

    try {
     const response = await axios.post('/api/acceptMessage',{AcceptMessages:!AcceptMessages});
     setValue('AcceptMessages',!AcceptMessages);
     toast.success(response?.data.message)     
    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>;
       const errorMessage =
         axiosError.response?.data?.message || "failed to update messages Acceptance status";
       toast.error(errorMessage);
    }
  }
   const router = useRouter()
  if(!session || !session.user){
   router.push('/login');
   return;
  }
  const {username} = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;

   const profileUrl = `${baseUrl}/u/${username}`;

     const clipboardCopy = ()=>{
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile Url has been copied successfully!")
     }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={clipboardCopy}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("AcceptMessages")}
          checked={AcceptMessages}
          onCheckedChange={switchToggle}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {AcceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={deleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
