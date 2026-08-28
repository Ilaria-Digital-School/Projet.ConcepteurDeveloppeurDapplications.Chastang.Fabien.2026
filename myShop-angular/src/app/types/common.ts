import { Order } from "../models/order";
import { User } from "../models/user";

// Types used by components
export type UserLogin = { email: string; pswd: string };
export type Category = { name: string; description: string; img: string };
export type FullDesc = { title: string | undefined; description: string[] };
export type OrderExt = { order: Order; user: User | undefined };
