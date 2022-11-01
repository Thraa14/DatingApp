import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() CancelRegister = new EventEmitter();
  model : any = {};
  RegisterForm : FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountservice: AccountService,
    private toastr: ToastrService, private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.InitalizeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18 )
  }

  InitalizeForm()
  {
    this.RegisterForm = this.fb.group(
      {
        username : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)] ],
        gender : ['', [Validators.required]],
        knownAs : ['', [Validators.required ]],
        city : ['', [Validators.required ]],
        country : ['', [Validators.required]],
        dateOfBirth : ['', [Validators.required]],
        password : ['', [ Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
        confirmPassword : [ '',[Validators.required, this.matchValues('password')]]
      }
    )

    this.RegisterForm.controls.password.valueChanges.subscribe( ()=>
    {
      this.RegisterForm.controls.confirmPassword.updateValueAndValidity();
    });

  }

  matchValues(matchTo: string) : ValidatorFn
  {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value? null : { isMatching: true}
    }
  }

  Register(){
    this.accountservice.Register(this.RegisterForm.value)
    .subscribe( response => {
    this.router.navigateByUrl('/members') },
    error => {
      this.validationErrors = error;
    })
  }

  Cancel(){
    this.CancelRegister.emit(false);
  }

}
