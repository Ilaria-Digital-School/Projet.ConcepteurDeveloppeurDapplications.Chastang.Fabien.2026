import { Order } from '../../models/order';
import { User } from '../../models/user';

export type ItemCst = { value: number; id: string; label: string };
export type ItemCstShort = { value: number; label: string };
export type UserLogin = { email: string; pswd: string };
export type Category = { name: string; description: string; img: string };
export type FullDesc = { title: string | undefined; description: string[] };
export type OrderExt = { order: Order; user: User | undefined };
export type SortParams = { col: string; sort: boolean; up: boolean };
