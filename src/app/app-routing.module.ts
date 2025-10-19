import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Import সব কম্পোনেন্ট
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
import {ExpensetypeComponent} from './pages/expense/expensetype/expensetype.component';
import { AddBiboroniComponent } from './pages/meeting/add-biboroni/add-biboroni.component';
import { MeetingHistoryComponent } from './pages/meeting/meeting-history/meeting-history.component';
import { DebitComponent } from './pages/accounts/debit/debit.component';
import { CreditComponent } from './pages/accounts/credit/credit.component';
import { BalanceComponent } from './pages/accounts/balance/balance.component';
import { ReportComponent } from './report/report.component';
import { MemberinfoComponent } from './pages/memberinfo/memberinfo.component';
import { MembertrnsComponent } from './pages/membertrns/membertrns.component';
import { MemberdeactiveComponent } from './pages/memberdeactive/memberdeactive.component';
import { LoanInfoComponent } from './kisti-subscription/loan-info/loan-info.component';
import { LoanDueComponent } from './kisti-subscription/loan-due/loan-due.component';
import { LoanPaidComponent } from './kisti-subscription/loan-paid/loan-paid.component';
import { ReckistiComponent } from './accounts/reckisti/reckisti.component';
import { RecsubscriptionComponent } from './accounts/recsubscription/recsubscription.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectmemberassignComponent } from './pages/projectmemberassign/projectmemberassign.component';
import { RegularkistiComponent } from './pages/regularkisti/regularkisti.component';
import { BalancewithdrawComponent } from './pages/balancewithdraw/balancewithdraw.component';
import { MemberbalanceComponent } from './pages/accounts/memberbalance/memberbalance.component';
import { PaidkistiComponent } from './pages/memberinfo/paidkisti/paidkisti.component';
import { PaidsubscriptionComponent } from './pages/memberinfo/paidsubscription/paidsubscription.component';
import { PaidregularsubscriptionComponent } from './pages/memberinfo/paidregularsubscription/paidregularsubscription.component';
import { JournalComponent } from './pages/accounts/journal/journal.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
    { path: 'report', component: ReportComponent },
      // Usermanage
      { path: 'usermanage/add-user', component: AddUserComponent },
      { path: 'usermanage/user-mapping-role', component: UserMappingRoleComponent },

      // Staffs
      { path: 'staffs/add-staff', component: AddStaffComponent },
      { path: 'staffs/staff-info', component: StaffInfoComponent },

      // Advisory
      { path: 'advisory/add-advisory', component: AddAdvisoryComponent },
      { path: 'advisory/active-advisory', component: ActiveAdvisoryComponent },
      { path: 'advisory/all-advisory', component: AllAdvisoryComponent },

      // Kisti & Subscription
      { path: 'kisti-subscription/kisti-info', component: KistiInfoComponent },
      { path: 'kisti-subscription/kisti-due', component: KistiDueComponent },
      { path: 'kisti-subscription/kisti-paid-info', component: KistiPaidInfoComponent },
      { path: 'kisti-subscription/subscription-info', component: SubscriptionInfoComponent },
      { path: 'kisti-subscription/subscription-due', component: SubscriptionDueComponent },
      { path: 'kisti-subscription/subscription-paid', component: SubscriptionPaidComponent },
      { path: 'kisti-subscription/loan-info', component: LoanInfoComponent },
      { path: 'kisti-subscription/loan-due', component: LoanDueComponent },
      { path: 'kisti-subscription/loan-paid', component: LoanPaidComponent },

      // Expense
      { path: 'expense/add-expense', component: AddExpenseComponent },
      { path: 'expense/expense-history', component: ExpenseHistoryComponent },
      { path: 'expense/expense-type', component: ExpensetypeComponent },

      // Meeting
      { path: 'meeting/add-biboroni', component: AddBiboroniComponent },
      { path: 'meeting/meeting-history', component: MeetingHistoryComponent },

      // Accounts
      { path: 'accounts/debit', component: DebitComponent },
      { path: 'accounts/credit', component: CreditComponent },
      { path: 'accounts/balance', component: BalanceComponent },
      { path: 'member/memberinfo', component: MemberinfoComponent },
      { path: 'member/membertrns', component: MembertrnsComponent },
      { path: 'member/memberdeactive', component: MemberdeactiveComponent },
      { path: 'accounts/reckisti', component: ReckistiComponent },
      { path: 'accounts/recsubscription', component: RecsubscriptionComponent },
      { path: 'project/projectinfo', component: ProjectComponent },
       { path: 'projectmember/projectmember', component: ProjectmemberassignComponent },
       { path: 'regular/regularkistsubs', component: RegularkistiComponent },
        { path: 'bal/balancewithdraw', component: BalancewithdrawComponent },
     { path: 'bal/membalance', component: MemberbalanceComponent },
 { path: 'mem/memberkistipaid', component: PaidkistiComponent },
 { path: 'mem/membersubspaid', component: PaidsubscriptionComponent },
{ path: 'mem/memberregusubspaid', component: PaidregularsubscriptionComponent },
{ path: 'accounts/journal', component: JournalComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
