import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeader } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor( private http : HttpClient) { }

  GetMessages( pageNumber: number, pageSize: number, container: string)
  {
    let params = getPaginationHeader(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  GetMessagesThread(username: string)
  {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }
}
