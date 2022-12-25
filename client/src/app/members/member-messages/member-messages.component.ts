import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm?: NgForm; 
  @Input() messages: Message[] = [];
  @Input() username?: string;
  messageContent = '';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  SendMessage(){
    if(!this.username) return;
    this.messageService.SendMessage(this.username, this.messageContent).subscribe({
      next: message => {
        this.messages.push(message);
        this.messageForm?.reset()
      }
    });
  }

}
