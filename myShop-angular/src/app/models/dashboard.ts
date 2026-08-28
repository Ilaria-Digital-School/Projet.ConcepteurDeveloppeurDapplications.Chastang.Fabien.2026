import { Subject } from "rxjs";
import { DashboardArrays, SortElement, SortVariables } from "../types/dashboard";
import { Dashboard } from "../constants/dashboard";

export class DashboardHandle<T> {
  // Object containing the 5 arrays
  arrays: DashboardArrays<T>;
  // Used for searching
  searchByTextSubject: Subject<string>;
  searchByRefSubject: Subject<string>;
  selectedValue: number;
  // Used for sorting
  sortElements!: SortElement<T>[];
  sortVariables!: SortVariables[];

  constructor() {
    this.arrays = new DashboardArrays<T>();
    this.searchByTextSubject = new Subject<string>();
    this.searchByRefSubject = new Subject<string>();
    this.selectedValue= -1;
  }

  // Search methods ///////////////////////////////////////////////////////////

  // Search by email (User and Order) or name (Product)
  searchTextItems(text: string) {
    this.searchByTextSubject.next(text);
  }

  // Search by reference (User, Product and Order)
  searchRefItems(reference: string) {
    this.searchByRefSubject.next(reference);
  }

  // Search by role (User), stock (Product) or status (Order)
  filterByValue!: () => void;

  selectValueItems(select: any) {
    this.selectedValue = Number(select.options[select.selectedIndex].value);
    this.filterByValue();
  }

  // Sort method //////////////////////////////////////////////////////////////

  // Sort all arrays
  sort(column: string) {
    Dashboard.sort<T>(this.arrays, this.sortElements, this.sortVariables, column);
  }
}
