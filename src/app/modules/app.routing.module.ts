import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcessionDashboardComponent } from '../components/concession-dashboard/concession-dashboard.component';
import { CreateComponent } from '../components/create/create.component';
import { LoginComponent } from '../components/login/login.component';
import { UploadComponent } from '../components/upload/upload.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ConcessionDashboardComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
