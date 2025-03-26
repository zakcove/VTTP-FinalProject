import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin.guard';
import { SnackListComponent } from './components/snack-list/snack-list.component';
import { SnackDetailComponent } from './components/snack-detail/snack-detail.component';
import { SnackFormComponent } from './components/snack-form/snack-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: SnackListComponent },
      { path: 'new', component: SnackFormComponent, canActivate: [adminGuard] },
      { path: ':id', component: SnackDetailComponent },
      { path: ':id/edit', component: SnackFormComponent, canActivate: [adminGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnacksRoutingModule { }
