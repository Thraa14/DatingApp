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
  loading= false;

  constructor( private messageService: MessageService) { }

  ngOnInit(): void {
    this.LoadMessages();
  }

  LoadMessages(){
    this.loading = true;
    this.messageService.GetMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: respone => {
        this.messages = respone.result;
        this.pagination = respone.pagination;
        this.loading = false;
      }
    });
  }

  PageChanged(event: any){
    if(this.pageNumber !== event.page){
      this.pageNumber = event.page;
    }
  }


  DeleteMessage(id : number)
  {
    this.messageService.DeleteMessage(id).subscribe({
      next: () => this.messages?.splice(this.messages.findIndex(m => m.id === id.toString()), 1)
    })
  }

}
