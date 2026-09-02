import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message-service';
import { Message } from '../../models/message';
import { FormTooltip } from '../form-tooltip/form-tooltip';

const HELP_HTML = `
Les champs marqués d'un astérisque (<span style="color: red; padding: 0 3px">*</span>) sont
obligatoires.
`;

// Component //////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-add-message',
  imports: [FormsModule, FormTooltip],
  templateUrl: './add-message.html',
  styleUrl: './add-message.css',
})
export class AddMessage {
  // Native classes / Application services
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Class properties
  message: Message = new Message();
  helpHTML: string = HELP_HTML;

  // Check the form ///////////////////////////////////////////////////////////

  // Check the maximum length for the name to inform the user
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Check the email
  errorEmail(value: string): boolean {
    const RE_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof value === 'string' && !RE_EMAIL.test(value);
  }

  // Check the minimum length of the message
  errorMinlengthStrict(value: string, minlen: number): boolean {
    let error = false;
    if (typeof value === 'string') {
      const VALUE = value.trim().replace(/\s{2,}/g, ' ');
      const RE = new RegExp('(.{0,}\\S.{0,}){' + minlen + ',}');
      error = !RE.test(VALUE);
    }
    return error;
  }

  // Submit the form //////////////////////////////////////////////////////////

  // Save the message
  submit(messageForm: NgForm) {
    const MESSAGE = new Message();

    const FORM_VAL = messageForm.value;
    MESSAGE.name = FORM_VAL.userName.trim();
    MESSAGE.email = FORM_VAL.userEmail.trim();
    MESSAGE.text = FORM_VAL.userMessage.trim();

    // Add the product
    this.messageService.addMessage(MESSAGE).subscribe({
      next: (res: Message) => {
        alert('Le message est enregistré.');
        this.router.navigate(['/']); // Go to homepage
      },
      error: (err: any) => {
        alert("Une erreur s'est produite lors de l'enregistrement.");
        console.log(err);
      },
    });
  }
}
