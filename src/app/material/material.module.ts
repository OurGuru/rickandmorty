import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

const MaterialComponents = [
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule
];

@NgModule({
  exports: [MaterialComponents],
  imports: [],
})
export class MaterialModule {}
