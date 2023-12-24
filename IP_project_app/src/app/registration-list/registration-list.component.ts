import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../services/api.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  providers: [ApiService],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatTableModule, MatInputModule, HttpClientModule,
  RouterModule],
  templateUrl: './registration-list.component.html',
  styleUrl: './registration-list.component.css'
})
export class RegistrationListComponent implements OnInit{

  public dataSource!: MatTableDataSource<User>;
  public users!: User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;  //to navigate the content, change pages etc...
  @ViewChild(MatSort) sort!: MatSort;  //sorting from angular material
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'package', 'enquiryDate', 'action'];

  constructor(private api: ApiService, private router: Router, private confirm: NgConfirmService, private toast: NgToastService)
  {
    
  }
  
  getUsers(){
    this.api.getRegisteredUser().subscribe(res=>{          //result from the API call
      console.log("getUsers() has been called!");
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
      console.table(res);
    })
  }

  applyFilter(event: Event) {    //copied from angular material
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.router.navigate(['update', id])
  }

  delete(id:number){
    this.confirm.showConfirm("Are you sure you want to delete?",  //the showConfirm method has YES/NO scenarios
    ()=>{
      this.api.deleteRegistered(id).subscribe(res=>{
        this.toast.success({detail: 'SUCCESS', summary: 'Deleted successfully', duration: 5000})
        this.getUsers();
      })
    },
    ()=>{

    })
  }

  ngOnInit(): void {    //method invoked once when the component is instantiated
    this.getUsers();
  }

}
