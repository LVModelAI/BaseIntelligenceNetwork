import { toast } from "react-toastify";

export const wallet_status = {
    error: "Problem with connecting wallet: ",
    success: "Connected wallet to"
}
export const success = (content: string) => toast.success(content)

export const error = (content: string) => toast.error(content)