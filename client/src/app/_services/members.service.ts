import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';

@Injectable({
  providedIn: 'root'
})

export class MembersService
{
  baseUrl = environment.apiUrl;

  constructor( private http: HttpClient) { }

  GetMembers()
  {
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  GetMember(username: string)
  {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
}
