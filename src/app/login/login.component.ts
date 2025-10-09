import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageLoaderService } from '../image-loader.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  companyForm!: FormGroup;  // Company form
  logoUrl: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  logoBase64: string = ''; // uploaded file base64
   apiurl:string=environment.apiBaseUrl;
  constructor(
    private formBuilder: FormBuilder,
    private imageLoader: ImageLoaderService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.companyForm = this.formBuilder.group({
      id: [0],
      cName: ['', Validators.required],
      cPhone: ['', Validators.required],
      cEmail: ['', [Validators.required, Validators.email]],
      cWebsite: [''],
      cAddress: [''],
      cLogo: [''],
      createAt: [new Date().toISOString()]
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
          this.authService.saveAuthData(jwtToken, role, fullname, username, cId);

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

  // File upload → Base64
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoBase64 = reader.result as string;
        this.companyForm.patchValue({ cLogo: this.logoBase64 });
      };
      reader.readAsDataURL(file);
    }
  }

  // Save company
  createCompany(): void {
    if (this.companyForm.invalid) {
      alert('Please fill company details correctly.');
      return;
    }

    const companyData = this.companyForm.value;
    this.http.post(this.apiurl+'/Log/companyadd', companyData).subscribe({
      next: (res) => {
        alert('Company created successfully!');
        console.log(res);
        
      },
      error: (err) => {
        console.error('Error creating company', err);
        alert('Failed to create company.');
      }
    });
  }
}
