// Types used by the dashboard
export class DashboardArrays<T> {
  unfiltered: Array<T> = [];
  filteredText: Array<T> = [];
  filteredRef: Array<T> = [];
  filteredTextRef: Array<T> = [];
  filteredItems: Array<T> = [];
}
export type SortFunction<T> = (array: Array<T>, direction: boolean) => Array<T>;
export type SortElement<T> = {
  col: string;
  up: boolean;
  func: SortFunction<T>;
  HTMLCol: HTMLElement;
};
export type SortVariables = { col: string; sort: boolean; up: boolean };
