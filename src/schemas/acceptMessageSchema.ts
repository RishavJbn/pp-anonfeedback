import z from "zod";


export const acceptMessageSchema = z.object({
  AcceptMessages: z.boolean(),
});