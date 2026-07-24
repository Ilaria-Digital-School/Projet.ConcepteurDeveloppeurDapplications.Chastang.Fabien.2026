export class Interests {
  fieldName = 'interests';

  other = [];
  list = [
    { value: 1, id: 'clothes', label: 'Vêtements' },
    { value: 2, id: 'accessories', label: 'Accessoires' },
  ];

  // Get the ID from the name and the name from the ID
  getId(interestName: string) {
    const NAME = interestName.trim().toLowerCase();
    const INTEREST = this.list.find((item) => item.label.toLowerCase() == NAME);
    return INTEREST ? INTEREST.value : 0;
  }
  getName(interestId: number) {
    const INTEREST = this.list.find((item) => item.value == interestId);
    return INTEREST ? INTEREST.label : undefined;
  }
}
