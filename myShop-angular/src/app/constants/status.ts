import { EnumStatus } from '../enums/order-status';

// User's gender class
export class Status {
  static list = [
    { value: EnumStatus.pending, id: 'pending', label: 'En attente' },
    { value: EnumStatus.inprogress, id: 'inprogress', label: 'En cours' },
    { value: EnumStatus.delivered, id: 'delivered', label: 'Livrée' },
    { value: EnumStatus.completed, id: 'completed', label: 'Terminée' },
    { value: EnumStatus.cancelled, id: 'cancelled', label: 'Annulée' },
    { value: EnumStatus.suspended, id: 'suspended', label: 'Suspendue' },
    { value: EnumStatus.expired, id: 'expired', label: 'Expirée' },
  ];

  // Get the ID from the name and the name from the ID
  static getId(statusName: string): number {
    const NAME = statusName.trim().toLowerCase();
    const STATUS = this.list.find((item: any) => item.label.toLowerCase() === NAME);
    return STATUS ? STATUS.value : -1;
  }
  static getName(statusId: number): string | null {
    const STATUS = this.list.find((item: any) => item.value === statusId);
    return STATUS ? STATUS.label : null;
  }
}
