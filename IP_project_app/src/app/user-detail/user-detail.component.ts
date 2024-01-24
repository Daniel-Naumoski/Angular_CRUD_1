import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatChipsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit{
  public userID!: number;
  userDetail!: User;
  constructor(private activatedRoute: ActivatedRoute, private api: ApiService){

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.userID = val['id'];
      this.fetchUserDetails(this.userID);
    })
  }

  fetchUserDetails(userID: number){
    this.api.getRegisteredUserId(userID).subscribe(res=>{
      this.userDetail = res;
      console.log(this.userDetail);
    })
  }

}
