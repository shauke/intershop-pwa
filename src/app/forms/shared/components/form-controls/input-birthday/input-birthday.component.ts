import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormElement } from '../form-element';

@Component({
  selector: 'ish-input-birthday',
  templateUrl: './input-birthday.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InputBirthdayComponent extends FormElement implements OnInit {
  @Input()
  minYear = 0;
  @Input()
  maxYear = 9999;
  dateForm: FormGroup;
  minDay = 1;
  maxDay = 31;
  minMonth = 1;
  maxMonth = 12;

  /*
    constructor
  */
  constructor(private fb: FormBuilder, protected translate: TranslateService) {
    super(translate);
  }

  /*
    on Init
  */
  ngOnInit() {
    this.setDefaultValues(); // call this method before parent init
    super.init();
    this.createForm();

    // FM: this is temporary (if any subscribe is kept, unsubscribe will be necessary)
    this.dateForm.valueChanges.subscribe(() => this.writeBirthday());
  }

  /*
   set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'birthday';
    this.label = this.label || 'Birthday'; // ToDo: Translation key
    this.errorMessages = this.errorMessages || {
      min: 'Please enter a valid birthday',
      max: 'Please enter a valid birthday',
    }; // ToDo

    const currentDate = new Date();
    this.minYear = this.minYear || currentDate.getFullYear() - 116;
    this.maxYear = this.maxYear || currentDate.getFullYear() - 16;
  }

  /*
    create internal form as a base format
  */
  private createForm() {
    this.dateForm = this.fb.group({
      day: ['', [Validators.min(this.minDay), Validators.max(this.maxDay)]],
      month: ['', [Validators.min(this.minMonth), Validators.max(this.maxMonth)]],
      year: ['', [Validators.min(this.minYear), Validators.max(this.maxYear)]],
    });

    // Add form group temporarily to the parent form to prevent a form submit with an invalid birth date
    // FM: commented out because child components don't change parent components' stuff
    // this.form.addControl('birthday-form', this.dateForm);
  }

  /*
    calculates the birthday in form 'yyyy-mm-dd' on base of the input fields
    writes the result to the given parent form control (controlName)
  */
  writeBirthday() {
    let day = this.dateForm.get('day').value;
    let month = this.dateForm.get('month').value;
    const year = this.dateForm.get('year').value;
    let birthday = '';
    if (
      day &&
      month &&
      year &&
      this.dateForm.get('day').valid &&
      this.dateForm.get('month').valid &&
      this.dateForm.get('year').valid
    ) {
      day = day.length === 1 ? '0' + day : day;
      month = month.length === 1 ? '0' + month : month;
      birthday = `${year}-${month}-${day}`;
    }

    this.form.get(this.controlName).setValue(birthday);
  }
}
