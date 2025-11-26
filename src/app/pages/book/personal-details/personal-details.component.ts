import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
export class PersonalDetailsComponent implements OnInit {
  personalDetailsForm!: FormGroup;
  @Input() payathotel: any
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.personalDetailsForm = this.getDetailsForm();

  }

  getDetailsForm() {
    return this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      specialRequest: [''],
      prepayment: ['', Validators.pattern('^[0-9]*$')],
      address: this.formBuilder.group({
        lane: ['', Validators.required],
        city: ['', Validators.required],
        state: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$'),
          ],
        ],
        country: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern('^[a-zA-Z ]*$'),
          ],
        ],
      }),
      source: ['mobile/website'],
    });
  }

  get address() {
    return this.personalDetailsForm.controls.address as FormGroup;
  }
}
