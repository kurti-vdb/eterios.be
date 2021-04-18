import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required ]),
    password: new FormControl('', [Validators.required])
  });

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.username?.value, this.loginForm.value['password'])
      .subscribe(
        response => {
          this.router.navigate(['/dashboard']);
        }, err => {
          console.log(err);
        });
  }

  isDisabled() {
    let isDisabled = false;
    isDisabled = this.username?.invalid || this.password?.invalid || this.loginForm.invalid ? true : false;
    return isDisabled;
  }
}
