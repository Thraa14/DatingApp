import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/members';
import { Pagination } from 'src/app/_models/Pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination ;
  userParams: UserParams;
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  constructor(private memberservice: MembersService) {
    this.userParams = this.memberservice.GetUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberservice.SetUserParams(this.userParams);
      this.memberservice.GetMembers(this.userParams).subscribe(response => {
        this.members = response.result;
        this.pagination = response.pagination;
        // this.pagination = { currentPage: 1, totalItems: 50, itemsPerPage: 10, totalPages: 5 };
      })
    }
  }

  resetFilters() {
    this.userParams = this.memberservice.ResetUserParams();
    this.loadMembers();
  }


  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberservice.SetUserParams(this.userParams);
      this.loadMembers();
    }
  }

}