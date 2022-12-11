import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/members';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent; 
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab?:TabDirective;
  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMembers();
    this.galleryOptions =
    [{
      width: '500px',
      height:'500px' ,
      imagePercent: 100 ,
      thumbnailsColumns: 4 ,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false,

    }];
  }

  GetImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push(
        {
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url 
        }
      );
    }
    return imageUrls;
  }

  loadMembers(){
    this.memberService.GetMember(this.route.snapshot.paramMap.get('username'))
    .subscribe(member => {
      this.member = member;
      this.galleryImages= this.GetImages();
    })

  }


  LoadMessages(){
    if(this.member){
      this.messageService.GetMessagesThread(this.member.userName).subscribe(
        {
          next: messages => this.messages = messages
        }
      );
    }

  }

  OnTabActivated(data: TabDirective){
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages'){
      this.LoadMessages();
    }
  }
}
