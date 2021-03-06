import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  error: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  signup(
    username: string,
    email: string,
    password1: string,
    password2: string
  ) {
    // call signup
    this.authService.signup(username, email, password1, password2).subscribe({
      next: (success) => this.router.navigate(['login']),
      error: (err) => (this.error = err),
    });
  }
}
