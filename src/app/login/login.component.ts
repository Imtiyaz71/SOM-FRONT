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

      // 🔹 1. Subscription expired check
      if (res.message && res.message.includes('expired')) {
        alert(res.message);
        return;
      }

      // 🔹 2. Invalid credentials or error message
      if (!res.token) {
        alert(res.message || 'Login failed. Please check credentials.');
        return;
      }

      // 🔹 3. Successful login
      const jwtToken = res.token;
      const role = res.role;
      const fullname = res.fullname;
      const uname = res.username;
      const cId = res.cid?.toString() ?? '';

      this.authService.saveAuthData(jwtToken, role, fullname, uname, cId);

      if (role === 'Admin' || role === 'User') {
        alert(res.message || 'Login successful!');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Login Unsuccessful! Invalid role.');
      }
    },
    error: (err) => {
      this.loading = false;
      const msg = err.error?.message || 'Login failed. Please check credentials.';
      alert(msg);
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
