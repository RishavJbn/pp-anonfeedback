import z from "zod";


export const acceptMessageSchema = z.object({
  acceptMeisAcceptingMessage: z.boolean(),
});