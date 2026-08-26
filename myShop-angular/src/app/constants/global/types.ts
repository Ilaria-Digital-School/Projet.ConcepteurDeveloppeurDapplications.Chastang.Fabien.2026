import { User } from '../../models/user';
import { Order } from '../../models/order';

export type ItemConst = { value: number; id: string; label: string };
export type ItemShort = { value: number; label: string };
export type SortParams = { col: string; sort: boolean; up: boolean };
export type OrderExt = { order: Order; user: User | undefined };
export type Category = { name: string; description: string; img: string };
export type FullDesc = { title: string | undefined; description: string[] };
