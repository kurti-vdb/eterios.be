import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm = new FormGroup({
    username: new FormControl('', [Validators.required ]),
    password: new FormControl('', [Validators.required])
  });

  get username() { return this.createForm.get('username'); }
  get password() { return this.createForm.get('password'); }

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }


  ngOnInit(): void {

  }

  create() {

    console.log("In create method");

    if (this.createForm.invalid) {
      return;
    }

    this.authService.create(this.username?.value, this.createForm.value['password'])
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/upload']);
        }, err => {
          console.log(err);
        });
  }

}
