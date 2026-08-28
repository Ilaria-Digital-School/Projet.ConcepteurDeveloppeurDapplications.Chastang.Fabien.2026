import { DashboardArrays, SortElement, SortVariables } from '../types/dashboard';

export class Dashboard {
  private static handleArrow(HTMLCol: HTMLElement, up: boolean) {
    const [TO_REP, REP_BY] = up ? ['down', 'up'] : ['up', 'down'];
    HTMLCol.classList.replace(`fa-caret-${TO_REP}`, `fa-caret-${REP_BY}`);
  }

  static sort<T>(
    arrays: DashboardArrays<T>,
    sortElements: SortElement<T>[],
    sortVariables: SortVariables[],
    column: string,
  ) {
    const SORTED = sortVariables.find((item: SortVariables) => item.sort);
    if (SORTED !== undefined) {
      for (const ELT_SORT of sortElements)
        if (ELT_SORT.col === column) {
          if (SORTED.col === column) {
            // The column has not changed, only the sort order is reversed
            SORTED.up = !SORTED.up;

            // Sort all arrays
            Object.values(arrays).forEach(
              (array: Array<T>) => (array = ELT_SORT.func(array, SORTED.up)),
            );

            // Reverse the arrow
            this.handleArrow(ELT_SORT.HTMLCol, SORTED.up);
          } else {
            // Initialize the new sort when the column has changed
            const TO_SORT = sortVariables.find((item: SortVariables) => item.col === column);
            if (TO_SORT) {
              TO_SORT.sort = true;
              TO_SORT.up = ELT_SORT.up;
            }

            // Sort all arrays
            Object.values(arrays).forEach(
              (array: Array<T>) => (array = ELT_SORT.func(array, ELT_SORT.up)),
            );

            // Hide the previous sort arrow
            SORTED.sort = false;
            for (const ELT_HIDE of sortElements)
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
