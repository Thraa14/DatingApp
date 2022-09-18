import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() CancelRegister = new EventEmitter();
  model : any = {};

  constructor(private accountservice: AccountService) { }

  ngOnInit(): void {
  }

  Register(){
    this.accountservice.Register(this.model)
    .subscribe( response => {
      console.log(response);
    },
    error => {
      console.log(error);
    })
  }

  Cancel(){
    this.CancelRegister.emit(false);
  }

}