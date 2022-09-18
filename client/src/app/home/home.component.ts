import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  Users: any;

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  RegisterToggle(){
    this.registerMode= !this.registerMode;
  }

  CancelRegisterMode(event: boolean){
     this.registerMode = event;
  }

}
