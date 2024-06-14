import { AuthService } from './../../auth.service';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
// import { router } from '../../app.routes';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule,RouterLink,CommonModule,ReactiveFormsModule],
  providers:[HttpResponse],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {

   userForm : FormGroup;
   isFormSubmit :boolean = false;
   errorMessage : string = '';

  constructor(private authService:AuthService ,private router : Router) {
    this.userForm = new FormGroup( {
      email : new FormControl("" , [Validators.required ,Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\\.[a-zA-Z]{2,4})+$')] ),
      password : new FormControl("" , [Validators.required] )
    });
    this.authService.logout();
  }
 
  

  onLoginButtonClicked(event:Event,email:string , password :string) :void{
    event.preventDefault();
    this.isFormSubmit =true;

    if(this.userForm.valid){
      this.authService.login(email , password).subscribe((res:HttpResponse<any>)=>{
         this.router.navigate(['/lists']);
         this.errorMessage = "";
         return res;
      },
      (error : HttpErrorResponse) => {
         this.showErrorMessage(error.error.error)
      });

      return;
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = "";
    }, 3000);
  }

}

