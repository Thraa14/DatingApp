import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/Pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages? : Message[];
  pagination?: Pagination;
  container: "Unread";
  pageNumber = 1;
  pageSize = 5;

  constructor( private messageService: MessageService) { }

  ngOnInit(): void {
    this.LoadMessages();
  }

  LoadMessages(){
    this.messageService.GetMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: respone => {
        this.messages = respone.result;
        this.pagination = respone.pagination;
      }
    });
  }

  PageChanged(event: any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
    }
  }

}
