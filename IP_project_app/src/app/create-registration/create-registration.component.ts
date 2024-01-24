import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../models/user.model';
import { Subscription, mergeMap } from 'rxjs';




@Component({
  selector: 'app-create-registration',
  providers: [ApiService],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatRadioModule,
  MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './create-registration.component.html',
  styleUrl: './create-registration.component.css'
})
export class CreateRegistrationComponent implements OnInit, OnDestroy{
  public genders: string[] = ["Male", "Female"];
  public packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  public importantList: string[] = ["Fat loss", "Energy and endurance", "Building lean muscle", "Overall fitness"];

  public registerForm!: FormGroup;         //Register form
  public userIdToUpdate!: number;       //Id of the user that will be updated
  public isUpdateActive: boolean = false;  //A boolean to act as a flag for which button to render (Submit/Update),(ngIf in html...)

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService, 
    private activatedRoute: ActivatedRoute, private router: Router)
  {

  }

  //#################### New variable needed because the unsubscribe method does not work on observables, but on Subscriptions
  subscription!: Subscription;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: ['', Validators.required],
      package: ['', Validators.required],
      important: [''],
      haveGymBefore: ['', Validators.required],
      enquiryDate: ['', Validators.required]
    })

    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res); //when the value of the "height" field changes we make a response and send it for calculation
    })

    //-------------------- Previous code with nested subscribe and no unsubscribe
    /*this.activatedRoute.params.subscribe(val=>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res=>{
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      })
    })*/
    //-------------------- Previous code with nested subscribe and no unsubscribe

    //#################### Improved code with pipe and mergeMap (no more nested subs) and addition of unsubscribe in ngOnDestroy

    this.subscription = this.activatedRoute.params.pipe(mergeMap(val=>{
      this.userIdToUpdate = val['id'];
      return this.api.getRegisteredUserId(this.userIdToUpdate)
    })).subscribe(res=>{
      this.isUpdateActive = true;
      this.fillFormToUpdate(res);
    })
    //#################### Improved code with pipe and mergeMap (no more nested subs) and addition of unsubscribe in ngOnDestroy
  }

  ngOnDestroy(): void {
    
    this.subscription.unsubscribe();
  }

  fillFormToUpdate(user: User)
  {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate 
    })
  }

  submit(){                                 //what happens when we click the "Submit" button, validation added
    if(this.registerForm.valid)
    {
      console.log(this.registerForm.value);  //logging values to the console just to test in the early stages
      this.api.postRegistration(this.registerForm.value)
        .subscribe(res => {
          this.toastService.success({detail:"Success", summary:"Enquiry Added", duration:5000}); 
          this.registerForm.reset();   //we reset the form after a successful registration
      })
    }
    else
    {
      this.toastService.error({detail:"Invalid input", summary:"Please fill in all required fields, check your input and try again!", duration:10000});
    }
  }

  update(){     //Added validation even for updating (makes no sense to delete someone's name and leave it empty...)
    if(this.registerForm.valid)
    {
      this.api.updateRegisteredUser(this.registerForm.value, this.userIdToUpdate).subscribe(res=>{
        this.toastService.success({ detail: "Success", summary: "Enquiry Updated", duration:5000});
        this.registerForm.reset();
        this.router.navigate(['list']);
      })
    }
    else
    {
      this.toastService.error({detail:"Invalid input", summary:"Please fill in all required fields, check your input and try again!", duration:10000});
    }
  }

  calculateBmi(heightValue: number){        
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height*height);                //logic for calculating bmi
    this.registerForm.controls['bmi'].patchValue(bmi);    //patches the value for the "read only field called bmi"
    switch(true)
    {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi <25):
        this.registerForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi > 25 && bmi <30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;
      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }

}
