import { Subject } from 'rxjs';
import { DashboardArrays, SortElement, SortVariables } from '../types/dashboard';

// Dashboard class
export class DashboardHandle<T> {
  // Object containing the 5 arrays used for sorting
  arrays: DashboardArrays<T> = new DashboardArrays<T>();

  // Used for searching
  searchTextSubject: Subject<string> = new Subject<string>();
  searchRefSubject: Subject<string> = new Subject<string>();
  selectedValue: number = -1;

  // Used for sorting
  sortElements!: SortElement<T>[];
  sortVariables!: SortVariables[];

  // Search methods ///////////////////////////////////////////////////////////

  // Search by email (User and Order) or name (Product)
  searchTextItems(text: string) {
    this.searchTextSubject.next(text);
  }

  // Search by reference (User, Product and Order)
  searchRefItems(reference: string) {
    this.searchRefSubject.next(reference);
  }

  // Sort method //////////////////////////////////////////////////////////////

  private handleArrow(HTMLCol: HTMLElement, up: boolean) {
    const [TO_REP, REP_BY] = up ? ['down', 'up'] : ['up', 'down'];
    HTMLCol.classList.replace(`fa-caret-${TO_REP}`, `fa-caret-${REP_BY}`);
  }

  // Sort all arrays
  sort(column: string) {
    const SORTED = this.sortVariables.find((item: SortVariables) => item.sort);
    if (SORTED !== undefined) {
      for (const ELT_SORT of this.sortElements)
        if (ELT_SORT.col === column) {
          if (SORTED.col === column) {
            // The column has not changed, only the sort order is reversed
            SORTED.up = !SORTED.up;

            // Sort all arrays
            Object.values(this.arrays).forEach(
              (array: Array<T>) => (array = ELT_SORT.func(array, SORTED.up)),
            );

            // Reverse the arrow
            this.handleArrow(ELT_SORT.HTMLCol, SORTED.up);
          } else {
            // Initialize the new sort when the column has changed
            const TO_SORT = this.sortVariables.find((item: SortVariables) => item.col === column);
            if (TO_SORT) {
              TO_SORT.sort = true;
              TO_SORT.up = ELT_SORT.up;
            }

            // Sort all arrays
            Object.values(this.arrays).forEach(
              (array: Array<T>) => (array = ELT_SORT.func(array, ELT_SORT.up)),
            );

            // Hide the previous sort arrow
            SORTED.sort = false;
            for (const ELT_HIDE of this.sortElements)
              if (ELT_HIDE.col === SORTED.col) {
                ELT_HIDE.HTMLCol.classList.add('hidden');
                break;
              }

            // Show the new sort arrow
            ELT_SORT.HTMLCol.classList.remove('hidden');
            this.handleArrow(ELT_SORT.HTMLCol, ELT_SORT.up);
          }
          break;
        }
    }
  }
}
