export class Interests {
  static other = { value: 0, label: null };
  static list = [
    { value: 1, id: 'clothes', label: 'Vêtements' },
    { value: 2, id: 'accessories', label: 'Accessoires' },
  ];

  // Get the ID from the name and the name from the ID
  static getId(interestName: string) {
    const NAME = interestName.trim().toLowerCase();
    const INTEREST = this.list.find((item) => item.label.toLowerCase() == NAME);
    return INTEREST ? INTEREST.value : this.other.value;
  }
  static getName(interestId: number) {
    const INTEREST = this.list.find((item) => item.value == interestId);
    return INTEREST ? INTEREST.label : this.other.label;
  }
}
