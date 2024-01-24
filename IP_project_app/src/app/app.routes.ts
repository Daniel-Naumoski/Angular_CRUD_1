import { Routes, RouterModule } from '@angular/router';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    //{path: '', redirectTo:'register', pathMatch:'full'},
    {path: '', redirectTo:'list', pathMatch:'full'},
    {path:'register', component:CreateRegistrationComponent},
    {path:'list', component:RegistrationListComponent},
    {path:'detail/:id', component:UserDetailComponent},
    {path:'update/:id', component:CreateRegistrationComponent},
    //{path:'undefined', component:UserDetailComponent},
    {path:'undefined', redirectTo:'list', pathMatch:'full'},
    //{path:'404', redirectTo:'list', pathMatch:'full'},
    //{path:'**', component:RegistrationListComponent},
    {path:'**', redirectTo:'list', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })


export class AppRoutingModule { }
