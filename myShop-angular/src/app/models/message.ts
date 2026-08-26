import { Common } from '../constants/global/common';

// Product class
export class Message {
  id: string = '';
  name: string = '';
  email: string = '';
  text: string = '';

  // Temporary properties, not saved
  additional: any = {}; // For additional properties (RxJS)

  constructor(
    name: string | null = null,
    email: string | null = null,
    text: string | null = null,
  ) {
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
