import { Order } from "../models/order";
import { User } from "../models/user";

// Types used by components
export type LoginData = { email: string; pswd: string }; // For users
export type FullDesc = { title: string | undefined; description: Array<string> }; // For products
export type OrderExt = { order: Order; user: User | undefined }; // For orders
