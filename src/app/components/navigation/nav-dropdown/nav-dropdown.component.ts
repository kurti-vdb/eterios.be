import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authservice';

@Component({
  selector: 'app-nav-dropdown',
  templateUrl: './nav-dropdown.component.html',
  styleUrls: ['./nav-dropdown.component.css']
})
export class NavDropdownComponent implements OnInit {

  @Input() public username?: string;
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  closeDropdown() {
    //document.getElementById('dropdown').style.display = "none";
    this.dropdown.nativeElement.style.display = "none";
  }

  showDropdown() {
    //document.getElementById('dropdown').style.display = "block";
    this.dropdown.nativeElement.style.display = "block";
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
