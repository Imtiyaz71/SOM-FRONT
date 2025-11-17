import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AddUserComponent } from './pages/usermanage/add-user/add-user.component';
import { UserMappingRoleComponent } from './pages/usermanage/user-mapping-role/user-mapping-role.component';
import { AddStaffComponent } from './pages/staffs/add-staff/add-staff.component';
import { StaffInfoComponent } from './pages/staffs/staff-info/staff-info.component';
import { AddAdvisoryComponent } from './pages/advisory/add-advisory/add-advisory.component';
import { ActiveAdvisoryComponent } from './pages/advisory/active-advisory/active-advisory.component';
import { AllAdvisoryComponent } from './pages/advisory/all-advisory/all-advisory.component';
import { KistiInfoComponent } from './pages/kisti-subscription/kisti-info/kisti-info.component';
import { KistiDueComponent } from './pages/kisti-subscription/kisti-due/kisti-due.component';
import { KistiPaidInfoComponent } from './pages/kisti-subscription/kisti-paid-info/kisti-paid-info.component';
import { SubscriptionInfoComponent } from './pages/kisti-subscription/subscription-info/subscription-info.component';
import { SubscriptionDueComponent } from './pages/kisti-subscription/subscription-due/subscription-due.component';
import { SubscriptionPaidComponent } from './pages/kisti-subscription/subscription-paid/subscription-paid.component';
import { AddExpenseComponent } from './pages/expense/add-expense/add-expense.component';
import { ExpenseHistoryComponent } from './pages/expense/expense-history/expense-history.component';
import { AddBiboroniComponent } from './pages/meeting/add-biboroni/add-biboroni.component';
import { MeetingHistoryComponent } from './pages/meeting/meeting-history/meeting-history.component';
import { DebitComponent } from './pages/accounts/debit/debit.component';
import { CreditComponent } from './pages/accounts/credit/credit.component';
import { BalanceComponent } from './pages/accounts/balance/balance.component';
import { ReportComponent } from './report/report.component';
import { MemberinfoComponent } from './pages/memberinfo/memberinfo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MembertrnsComponent } from './pages/membertrns/membertrns.component';
import { MemberdeactiveComponent } from './pages/memberdeactive/memberdeactive.component';
import { LoanInfoComponent } from './kisti-subscription/loan-info/loan-info.component';
import { LoanDueComponent } from './kisti-subscription/loan-due/loan-due.component';
import { LoanPaidComponent } from './kisti-subscription/loan-paid/loan-paid.component';
import { MatIconModule } from '@angular/material/icon';
import { ReckistiComponent } from './accounts/reckisti/reckisti.component';
import { RecsubscriptionComponent } from './accounts/recsubscription/recsubscription.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectmemberassignComponent } from './pages/projectmemberassign/projectmemberassign.component';
import { RegularkistiComponent } from './pages/regularkisti/regularkisti.component';
import { ExpensetypeComponent } from './pages/expense/expensetype/expensetype.component';
import { BalancewithdrawComponent } from './pages/balancewithdraw/balancewithdraw.component';
import { MemberbalanceComponent } from './pages/accounts/memberbalance/memberbalance.component';
import { PaidkistiComponent } from './pages/memberinfo/paidkisti/paidkisti.component';
import { PaidsubscriptionComponent } from './pages/memberinfo/paidsubscription/paidsubscription.component';
import { PaidregularsubscriptionComponent } from './pages/memberinfo/paidregularsubscription/paidregularsubscription.component';
import { JournalComponent } from './pages/accounts/journal/journal.component';
import { ArchivestaffComponent } from './pages/staffs/archivestaff/archivestaff.component';
import { ProjectbalanceComponent } from './pages/accounts/projectbalance/projectbalance.component';
import { AddprojectexpenseComponent } from './pages/expense/addprojectexpense/addprojectexpense.component';
import { ProjectexpensehistoryComponent } from './pages/expense/projectexpensehistory/projectexpensehistory.component';
import { NgChartsModule } from 'ng2-charts';
import { RevenueComponent } from './pages/accounts/revenue/revenue.component';
import { SensionComponent } from './pages/recept/loan/sension/sension.component';
import { PaidComponent } from './pages/recept/loan/paid/paid.component';
import { KistisubsComponent } from './pages/recept/kistisubs/kistisubs.component';
import { SubrecptComponent } from './pages/recept/subrecpt/subrecpt.component';
import { RegsubsrecptComponent } from './pages/recept/regsubsrecpt/regsubsrecpt.component';
import { ManagerevenueComponent } from './pages/finance/managerevenue/managerevenue.component';
import { SavingsComponent } from './pages/finance/savings/savings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    AddUserComponent,
    UserMappingRoleComponent,
    AddStaffComponent,
    StaffInfoComponent,
    AddAdvisoryComponent,
    ActiveAdvisoryComponent,
    AllAdvisoryComponent,
    KistiInfoComponent,
    KistiDueComponent,
    KistiPaidInfoComponent,
    SubscriptionInfoComponent,
    SubscriptionDueComponent,
    SubscriptionPaidComponent,
    AddExpenseComponent,
    ExpenseHistoryComponent,
    AddBiboroniComponent,
    MeetingHistoryComponent,
    DebitComponent,
    CreditComponent,
    BalanceComponent,
    ReportComponent,
    MemberinfoComponent,
    MembertrnsComponent,
    MemberdeactiveComponent,
    LoanInfoComponent,
    LoanDueComponent,
    LoanPaidComponent,
    ReckistiComponent,
    RecsubscriptionComponent,
    ProjectComponent,
    ProjectmemberassignComponent,
    RegularkistiComponent,
    ExpensetypeComponent,
    BalancewithdrawComponent,
    MemberbalanceComponent,
    PaidkistiComponent,
    PaidsubscriptionComponent,
    PaidregularsubscriptionComponent,
    JournalComponent,
    ArchivestaffComponent,
    ProjectbalanceComponent,
    AddprojectexpenseComponent,
    ProjectexpensehistoryComponent,
    RevenueComponent,
    SensionComponent,
    PaidComponent,
    KistisubsComponent,
    SubrecptComponent,
    RegsubsrecptComponent,
    ManagerevenueComponent,
    SavingsComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatIconModule,
    NgChartsModule
  ],
 providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
