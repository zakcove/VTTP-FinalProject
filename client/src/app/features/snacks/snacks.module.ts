import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SnacksRoutingModule } from './snacks-routing.module';
import { SnackListComponent } from './components/snack-list/snack-list.component';
import { SnackDetailComponent } from './components/snack-detail/snack-detail.component';
import { SnackFormComponent } from './components/snack-form/snack-form.component';
import { snackReducer } from './store/snack.reducer';
import { SnackEffects } from './store/snack.effects';
import { SnackService } from './services/snack.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SnacksRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    StoreModule.forFeature('snacks', snackReducer),
    EffectsModule.forFeature([SnackEffects])
  ],
  providers: [SnackService]
})
export class SnacksModule { }
