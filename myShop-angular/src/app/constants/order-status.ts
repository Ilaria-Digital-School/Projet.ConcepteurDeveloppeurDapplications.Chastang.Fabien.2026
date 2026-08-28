import { EnumStatus } from '../enums/order-status';
import { ItemCst } from '../types/items';

// User's gender class
export class OrderStatus {
  static list: ItemCst[] = [
    { value: EnumStatus.pending, id: 'pending', label: 'En attente' },
    { value: EnumStatus.inprogress, id: 'inprogress', label: 'En cours' },
    { value: EnumStatus.delivered, id: 'delivered', label: 'Livrée' },
    { value: EnumStatus.completed, id: 'completed', label: 'Terminée' },
    { value: EnumStatus.cancelled, id: 'cancelled', label: 'Annulée' },
    { value: EnumStatus.suspended, id: 'suspended', label: 'Suspendue' },
    { value: EnumStatus.expired, id: 'expired', label: 'Expirée' },
  ];

  // Get the value from the label and the label from the value
  static getValue(label: string): number {
    const LABEL = label.trim().toLowerCase();
    const ITEM = this.list.find((item: ItemCst) => item.label.toLowerCase() === LABEL);
    return ITEM ? ITEM.value : -1;
  }
  static getLabel(value: number, other: string | undefined = undefined): string | null {
    const ITEM = this.list.find((item: ItemCst) => item.value === value);
    return !ITEM ? (other ? other : null) : ITEM.label;
  }
}
