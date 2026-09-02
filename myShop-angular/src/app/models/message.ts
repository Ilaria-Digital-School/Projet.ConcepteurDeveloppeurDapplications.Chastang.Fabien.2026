// Message class
export class Message {
  id: string = '';
  dateIns: number = Date.now(); // Insertion date
  dateRep: number | null = null; // Response date
  name: string = '';
  email: string = '';
  text: string = '';
  visible: boolean = true;

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS)

  constructor(
    dateIns: number | null = null,
    dateRep: number | null = null,
    name: string | null = null,
    email: string | null = null,
    text: string | null = null,
  ) {
    if (typeof dateIns === 'number') this.dateIns = dateIns;
    if (typeof dateRep === 'number') this.dateRep = dateRep;
    if (typeof name === 'string') this.name = name;
    if (typeof email === 'string') this.email = email;
    if (typeof text === 'string') this.text = text;
  }

  // Remove these properties before saving the message
  removeBeforeSaveMessage() {
    const MESSAGE = new Message();
    Object.assign(MESSAGE, this);
    delete MESSAGE.additional;
    return MESSAGE;
  }
}
