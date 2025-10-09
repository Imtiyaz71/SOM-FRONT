import { Component, OnInit } from '@angular/core';
import { UserInfoService, UserInfoBasic, UserInfoEducation, UserPhoto } from '../../../services/user-info.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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

  apiBaseUrl: string = environment.apiBaseUrl + '/UserInfo';
  photoPreview: string | null = null;
  editUser: VW_UserInfo | null = null;
  editPhotoPreview: string | null = null;
  showEditUserModal: boolean = false;

  newUser: UserInfoBasic = this.getEmptyUser();
  newEducation: UserInfoEducation = this.getEmptyEducation();
  newPhoto: UserPhoto = { iD: 0, username: '', photo: '', createDate: '', updateDate: '' };

  role: string = '';
  fullname: string = '';
  username: string = '';

  showAddUserModal: boolean = false;
  showAddEducationModal: boolean = false;
  showAddPhotoModal: boolean = false;
  showUserDetailsModal: boolean = false;

  private searchSubject: Subject<string> = new Subject();

  constructor(private userInfoService: UserInfoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.role = this.authService.getRole() || 'User';
    this.fullname = this.authService.getfullnamename() || '--';
    this.username = this.authService.getusername() || '--';
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(username => this.performSearch(username));
  }

  loadUsers() {
    this.userInfoService.getuserbasicinfo().subscribe({
      next: data => { this.users = data; this.filteredUsers = data; },
      error: err => console.error(err)
    });
  }

  onDelete(username: string, deleteby: string) {
    this.userInfoService.deleteUser(username, deleteby).subscribe({
      next: (res) => {
        alert(res.message || res || 'User deleted successfully');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Failed to delete user');
      }
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

  openEditUserModal(user: UserInfoBasic) {
    this.selectedUser = null;
    this.editPhotoPreview = null;
    this.showEditUserModal = true;

    this.userInfoService.getUserInfoAll(user.username).subscribe({
      next: (data: VW_UserInfo) => {
        this.editUser = { ...data };
        if (data.username) {
          this.editPhotoPreview = data.photo ? `${this.apiBaseUrl}/userphotobyusername?Username=${user.username}` : null;
        }
      },
      error: (err) => console.error('Error loading user details', err)
    });
  }

  closeEditUserModal() {
    this.showEditUserModal = false;
    this.editUser = null;
    this.editPhotoPreview = null;
  }

  onPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
        this.newPhoto.photo = this.photoPreview.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  onEditPhotoSelected(event: any) {
    const file = event.target.files?.[0];
    if (file && this.editUser) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editPhotoPreview = reader.result as string;
        this.editUser!.photo = this.editPhotoPreview.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  saveEditUser() {
    if (!this.editUser) return;

    this.userInfoService.editUserInfo(this.editUser).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.loadUsers();
        this.closeEditUserModal();
      },
      error: (err) => console.error(err)
    });
  }

  getEmptyUser(): UserInfoBasic {
    return { id:0, fullName:'', username:'', email:'', phone:'', niD:'', address:'', father:'', mother:'', createDate:'', updateDate:'', cId: Number(this.authService.getcompanyid()) || 0 };
  }

  getEmptyEducation(): UserInfoEducation {
    return { id:0, degree:'', fieldOfStudy:'', schoolName:'', startDate:'', endDate:'', description:'', username:'', createDate:'', updateDate:'' };
  }

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
    if (!this.newPhoto.photo || !this.newPhoto.username) {
      console.warn('Username or photo missing');
      return;
    }

    this.userInfoService.addPhotoBase64(this.newPhoto).subscribe({
      next: () => {
        console.log('Photo uploaded successfully');
        this.closePhotoModal();
        this.photoPreview = `${this.apiBaseUrl}/userphotobyusername?Username=${this.newPhoto.username}`;
      },
      error: (err: any) => console.error('Error uploading photo', err)
    });
  }

  // === Added method to fix TS2339 error ===
  updateUser() {
    this.saveEditUser();
  }
}
