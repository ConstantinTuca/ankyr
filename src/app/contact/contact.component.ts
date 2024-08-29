import { Component } from '@angular/core';
import { faPaperPlane, faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  // standalone: true,
  // imports: [],
  styleUrls: ['./contact.component.css']
})

export default class ContactComponent {
  faPaperPlane = faPaperPlane; faAddressCard = faAddressCard;
  modal: any = {}; errors: any = {};

  constructor(private _spinner: NgxSpinnerService, private toastr: ToastrService) { }

  sendEmail = () => {
    if(!this.handleValidation()) return;
    // this._spinner.show();
    // axios.post('/api/contact', this.modal).then(() => {
    //   this.toastr.success('The message has been sent!');
    //   this.modal = {};
    //   this._spinner.hide();
    // }).catch(() => this.toastr.error('Error sending message!'));
  }

  handleValidation = () => {
    if (!this.modal.name) {
      this.toastr.error('The name is mandatory!');
      this.errors.name = true;
      return false;
    }

    if (!this.modal.email) {
      this.toastr.error('The email is mandatory!');
      this.errors.email = true;
      return false;
    } else {
      let regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (!regexEmail.test(this.modal.email)) {
        this.toastr.error(`Invalid email!`);
        this.errors.email = true;
        return false;
      }
    }

    if (!this.modal.subject) {
      this.toastr.error('The subject is mandatory!');
      this.errors.subject = true;
      return false;
    }

    if (!this.modal.message) {
      this.toastr.error('The message is mandatory!');
      this.errors.message = true;
      return false;
    }

    return true;
  };
}