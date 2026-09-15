// Message class
export class Message {
  _id: string = '';
  dateIns: Date = new Date(Date.now()); // Insertion date
  dateRep: Date | null = null; // Response date
  name: string = '';
  email: string = '';
  text: string = '';
  dateVisible: Date | null = null; // Date on which the data was show or hidden
  visible: boolean = true;

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS)

  constructor(
    dateIns: Date | null = null,
    dateRep: Date | null = null,
    name: string | null = null,
    email: string | null = null,
    text: string | null = null,
  ) {
    if (dateIns instanceof Date) this.dateIns = dateIns;
    if (dateRep instanceof Date) this.dateRep = dateRep;
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
