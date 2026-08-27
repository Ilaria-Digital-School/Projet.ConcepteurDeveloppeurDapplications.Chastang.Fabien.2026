import { Order } from '../../models/order';
import { User } from '../../models/user';

// Types used by constants
export type ItemCst = { value: number; id: string; label: string };
export type ItemCstShort = { value: number; label: string };

// Types used by components
export type UserLogin = { email: string; pswd: string };
export type Category = { name: string; description: string; img: string };
export type FullDesc = { title: string | undefined; description: string[] };
export type OrderExt = { order: Order; user: User | undefined };

// Types used for sorting
export type SortArrays = Array<any[]>;
export type SortFunction = (array: any[], direction: boolean) => any[];
export type SortElement = { col: string; up: boolean; func: SortFunction; HTMLCol: HTMLElement };
export type SortVariables = { col: string; sort: boolean; up: boolean };
