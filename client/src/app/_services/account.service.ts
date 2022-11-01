import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { MembersService } from './members.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService 
{
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$= this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  logIn(model:any)
  {
    return this.http.post(this.baseUrl + "account/login", model)
    .pipe(
      map( (response: User) =>
      {
        const user = response;
        if(user)
        {
          this.SetCurrentUser(user);
        }
      } )
    )
  }

  Register (model : any){
    return this.http.post(this.baseUrl + 'account/register', model)
    .pipe(
      map( (user: User) => {
        if(user) {
          this.SetCurrentUser(user);
        }
      })
    )

  }

  SetCurrentUser (user: User)
  {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logOut()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }



}

