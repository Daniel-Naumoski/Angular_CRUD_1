import { Routes } from '@angular/router';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

export const routes: Routes = [
    {path: '', redirectTo:'register', pathMatch:'full'},
    {path:'register', component:CreateRegistrationComponent},
    {path:'list', component:RegistrationListComponent},
    {path:'detail/:id', component:UserDetailComponent},
    {path:'update/:id', component:CreateRegistrationComponent}
];
