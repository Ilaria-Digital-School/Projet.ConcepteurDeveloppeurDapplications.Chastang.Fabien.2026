import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact-service';
import { Contact } from '../../models/contact';
import { Tooltip } from '../tooltip/tooltip';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, Tooltip],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  // Native classes / Application services
  private router = inject(Router);
  private contactService = inject(ContactService);

  // Class properties
  contact: Contact = new Contact();
  helpHTML: string = `
    Les champs marqués d'une étoile (<span style="color: red; padding: 0 3px">*</span>) sont
    obligatoires.
  `;

  // Check the form ///////////////////////////////////////////////////////////

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

  errorEmail(value: string): boolean {
    const RE_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof value === 'string' && !RE_EMAIL.test(value);
  }

  // Check the maximum length
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Submit the form //////////////////////////////////////////////////////////

  // Save the message
  submit(contactForm: NgForm) {
    const CONTACT = new Contact();
    CONTACT.additional = undefined; // Remove this property before saving

    const FORM_VAL = contactForm.value;
    CONTACT.name = FORM_VAL.userName.trim();
    CONTACT.email = FORM_VAL.userEmail.trim();
    CONTACT.message = FORM_VAL.userMessage.trim();

    // Add the product
    this.contactService.addContactMessage(CONTACT).subscribe({
      next: (res: Object) => {
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
