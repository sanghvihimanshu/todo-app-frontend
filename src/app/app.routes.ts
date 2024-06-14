import { Routes } from '@angular/router';
import { BoxComponent } from './box/box.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';
export const routes: Routes = [

    { path: 'lists', component: BoxComponent},
    { path:'login', component:LoginPageComponent},
    { path:'register', component:RegisterComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
    