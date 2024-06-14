import { Component } from '@angular/core';
import { RouterLink, RouterModule ,Router} from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,RouterLink,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  errorMessage: string | null = null;
  userForm : FormGroup;
  isFormSubmit : boolean = false;

  constructor(private authService : AuthService, private router: Router) {
    this.userForm = new FormGroup ( {
      email: new FormControl("" , [Validators.required,Validators.pattern('^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\\.[a-zA-Z]{2,4})+$')]),
      password : new FormControl("" , [Validators.required , Validators.minLength(4)])
    });
    this.authService.removeSession();
  }

  onRegisterButtonClicked(email:string , password :string) {

    this.isFormSubmit=true ;

    if(this.userForm.valid){
      
      this.authService.register(email ,password).subscribe((res: HttpResponse<any>) => {
       this.router.navigate(['/login']);
       this.errorMessage = null;
       return res;
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400 ) {
          this.showErrorMessage(error.error.error);
        } else {
          this.showErrorMessage('An error ocured');
        }
      });
      return;
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
