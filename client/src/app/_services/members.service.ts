import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/members';
import { PaginatedResult } from '../_models/Pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeader } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})

export class MembersService
{
  baseUrl = environment.apiUrl;
  members: Member [] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams : UserParams | undefined;

  constructor( private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe( user => {
      this.user= user;
      this.userParams= new UserParams(user);
    })
  }

  GetUserParams(){
    return this.userParams;
  }

  SetUserParams( params: UserParams){
    this.userParams = params; 
  }

  ResetUserParams(){
    if(this.user){
      this.userParams= new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  GetMembers(userParams: UserParams)
  {
    var response = this.memberCache.get(Object.values(userParams).join('-'));  
    if(response) {
      return of(response);
    }  
    let params =  getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);


    return getPaginatedResult<Member[]>( this.baseUrl + 'users' , params, this.http)
    .pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }));
  }

  GetMember(username: string)
  {
    const member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.result), [] )
    .find((member: Member) => member.userName === username );

    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  UpdateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe( 
      map( () => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
        }
      )
    );
  }

  SetMainPhoto(photoId: number)
  {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {} );
  }

  DeletePhoto(photoId:number)
  {
    return this.http.delete(this.baseUrl + 'users/delete-photo/'+ photoId)
  }

  AddLike(userName: string)
  {
    return this.http.post(this.baseUrl + 'likes/' + userName, {});
  }

  GetLikes(predicate : string, pageNumber: number, pageSize: number)
  {
    let params = getPaginationHeader(pageNumber,pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult<Member[]>(this.baseUrl + 'likes' , params, this.http);
  }
}
