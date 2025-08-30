import { Component, OnInit } from '@angular/core';
import { UserInfoService, UserInfoBasic, UserInfoEducation, UserPhoto } from '../../../services/user-info.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
// Frontend model for user details
export interface VW_UserInfo {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  niD: string | null;
  father: string | null;
  mother: string | null;
  degree?: string;
  fieldOfStudy?: string;
  schoolName?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  photo?: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  users: UserInfoBasic[] = [];
  filteredUsers: UserInfoBasic[] = [];
  searchText: string = '';
  selectedUser: VW_UserInfo | null = null;

  apiBaseUrl: string = environment.apiBaseUrl +'/UserInfo';
    photoPreview: string | null = null;
editUser: VW_UserInfo | null = null;
editPhotoPreview: string | null = null;
private editSelectedFile: File | null = null;
showEditUserModal: boolean = false;

  newUser: UserInfoBasic = this.getEmptyUser();
  newEducation: UserInfoEducation = this.getEmptyEducation();
  newPhoto: UserPhoto = { iD: 0, username: '', photo: '', createDate: '', updateDate: '' };
  role: string = '';

  // Modal flags
  showAddUserModal: boolean = false;
  showAddEducationModal: boolean = false;
  showAddPhotoModal: boolean = false;
  showUserDetailsModal: boolean = false;

  private searchSubject: Subject<string> = new Subject();
  private selectedFile: File | null = null;

  constructor(private userInfoService: UserInfoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.role = this.authService.getRole() || 'User';
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(username => this.performSearch(username));
  }

  loadUsers() {
    this.userInfoService.getuserbasicinfo().subscribe({
      next: data => { this.users = data; this.filteredUsers = data; },
      error: err => console.error(err)
    });
  }

  onSearchInput() { this.searchSubject.next(this.searchText.trim()); }

  performSearch(username: string) {
    if (!username) { this.filteredUsers = this.users; return; }
    this.filteredUsers = this.users.filter(u => u.username.toLowerCase().includes(username.toLowerCase()));
  }

  // Modal open/close
  openAddUserModal() { this.showAddUserModal = true; }
  closeAddUserModal() { this.showAddUserModal = false; }

  openEducationModal() { this.showAddEducationModal = true; }
  closeEducationModal() { this.showAddEducationModal = false; }

  openPhotoModal(user?: UserInfoBasic) {
    this.showAddPhotoModal = true;
    if (user) this.newPhoto.username = user.username;
  }
  closePhotoModal() { this.showAddPhotoModal = false; }

  openDetailsModal(user: UserInfoBasic) {
    this.selectedUser = null;
    this.photoPreview = null;
    this.showUserDetailsModal = true;

    this.userInfoService.getUserInfoAll(user.username).subscribe({
      next: (data: VW_UserInfo) => {
        this.selectedUser = data;
        if (data.username) {
          this.photoPreview = `${this.apiBaseUrl}/userphotobyusername?Username=${data.username}`;
        }
      },
      error: (err) => console.error('Error loading user details', err)
    });
  }

  closeUserDetailsModal() { this.showUserDetailsModal = false; }

// openEditUserModal(user: VW_UserInfo) {
//   this.editUser = { ...user }; // copy existing data
//   this.editPhotoPreview = user.photo ? `${this.apiBaseUrl}/userphotobyusername?Username=${user.username}` : null;
//   this.showEditUserModal = true;
// }
openEditUserModal(user: UserInfoBasic) {
    this.selectedUser = null;
    this.editPhotoPreview = null;
    this.showEditUserModal = true;

    this.userInfoService.getUserInfoAll(user.username).subscribe({
      next: (data: VW_UserInfo) => {
      //  this.selectedUser = data;
        this.editUser = { ...data };
        if (data.username) {
         this.editPhotoPreview = data.photo ? `${this.apiBaseUrl}/userphotobyusername?Username=${user.username}` : null;
        }
      },
      error: (err) => console.error('Error loading user details', err)
    });
  }
// Close edit modal
closeEditUserModal() {
  this.showEditUserModal = false;
  this.editUser = null;
  this.editPhotoPreview = null;
  this.editSelectedFile = null;
}

// Handle file selection in Edit modal
onEditPhotoSelected(event: any) {
  const file = event.target.files?.[0];
  if (file) {
    this.editSelectedFile = file;
    const reader = new FileReader();
    reader.onload = e => this.editPhotoPreview = reader.result as string;
    reader.readAsDataURL(file);
  }
}


// Save edited user
saveEditUser() {
  if (!this.editUser) return;

  const formData = new FormData();

  // Always send existing fields
  formData.append('username', this.editUser.username);
  formData.append('fullName', this.editUser.fullName || '');
  formData.append('phone', this.editUser.phone || '');
  formData.append('email', this.editUser.email || '');
  formData.append('address', this.editUser.address || '');
  formData.append('niD', this.editUser.niD || '');
  formData.append('father', this.editUser.father || '');
  formData.append('mother', this.editUser.mother || '');
  formData.append('degree', this.editUser.degree || '');
  formData.append('fieldOfStudy', this.editUser.fieldOfStudy || '');
  formData.append('schoolName', this.editUser.schoolName || '');
  formData.append('startDate', this.editUser.startDate || '');
  formData.append('endDate', this.editUser.endDate || '');
  formData.append('description', this.editUser.description || '');

  // Photo: optional
  if (this.editSelectedFile) {
    formData.append('file', this.editSelectedFile); // new file selected
  }
  // else do nothing, backend will retain existing photo

  this.userInfoService.editUserInfo(formData).subscribe({
    next: (res) => {
      console.log('User updated successfully');
      this.loadUsers(); // reload table
      this.closeEditUserModal();
    },
    error: (err) => console.error(err)
  });
}
  // Get empty models
  getEmptyUser(): UserInfoBasic {
    return { id:0, fullName:'', username:'', email:'', phone:'', niD:'', address:'', father:'', mother:'', createDate:'', updateDate:'' };
  }

  getEmptyEducation(): UserInfoEducation {
    return { id:0, degree:'', fieldOfStudy:'', schoolName:'', startDate:'', endDate:'', description:'', username:'', createDate:'', updateDate:'' };
  }

  // Save methods
  saveUser() {
    this.userInfoService.addUser(this.newUser).subscribe({
      next: () => { this.loadUsers(); this.newUser = this.getEmptyUser(); this.closeAddUserModal(); },
      error: (err: any) => console.error(err)
    });
  }

  saveEducation() {
    this.userInfoService.addEducation(this.newEducation).subscribe({
      next: () => { this.newEducation = this.getEmptyEducation(); this.closeEducationModal(); },
      error: (err: any) => console.error(err)
    });
  }

  savePhoto(): void {
    if (!this.selectedFile) {
      console.warn('No photo selected');
      return;
    }

    this.userInfoService.addPhoto(this.selectedFile, this.newPhoto.username).subscribe({
      next: () => {
        console.log('Photo uploaded successfully');
        this.selectedFile = null;
        this.closePhotoModal();

        // Update photo preview
        this.photoPreview = `${this.apiBaseUrl}/userphotobyusername?Username=${this.newPhoto.username}`;
      },
      error: (err: any) => console.error('Error uploading photo', err)
    });
  }

  onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }
}
