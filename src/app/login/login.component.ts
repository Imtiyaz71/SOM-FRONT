import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageLoaderService } from '../image-loader.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  logoUrl: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private imageLoader: ImageLoaderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.loadLogo();
  }

  loadLogo(): void {
    const logoUrl = 'https://avatars.githubusercontent.com/u/124091983';
    this.imageLoader.loadImage(logoUrl).subscribe({
      next: (blob: Blob) => {
        this.logoUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.error('Error loading logo image', err);
      }
    });
  }

  onSubmit(): void {
    console.log('onSubmit called');

    if (this.loginForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res && res.token && res.token.token) {
          const jwtToken = res.token.token;
          const role = res.token.role;
          const username = res.token.username;
          const fullname = res.token.fullname;
             const cId = res.token.cId;
          this.authService.saveAuthData(jwtToken, role,fullname,username,cId);

          if (role === 'Admin' || role === 'User') {
            alert('Login successful!');
            this.router.navigate(['/dashboard']);
          } else {
            alert('Login Unsuccessful! Invalid role.');
          }
        } else {
          alert('Invalid response from server');
        }
      },
      error: (err) => {
        this.loading = false;
        alert('Login Failed. Please check credentials.');
        console.error('Login Failed', err);
      }
    });
  }
}
