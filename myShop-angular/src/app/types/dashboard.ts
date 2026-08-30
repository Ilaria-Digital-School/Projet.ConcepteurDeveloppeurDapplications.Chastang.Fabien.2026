// Types used by the dashboard

// Object containing the 5 arrays used for sorting
export class DashboardArrays<T> {
  unfiltered: Array<T> = [];
  filteredText: Array<T> = [];
  filteredRef: Array<T> = [];
  filteredTextRef: Array<T> = [];
  filteredItems: Array<T> = [];
}

// Prototype of sorting functions
export type SortFunction<T> = (array: Array<T>, direction: boolean) => Array<T>;

// Object defining the sorting elements: all properties are fixed
export type SortElement<T> = {
  col: string;
  up: boolean;
  func: SortFunction<T>;
  HTMLCol: HTMLElement;
};

// Object defining the sorting variables: 'sort' and/or 'up' are updated each time a sort is performed
export type SortVariables = { col: string; sort: boolean; up: boolean };
