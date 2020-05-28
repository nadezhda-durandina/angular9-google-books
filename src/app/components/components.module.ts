import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from '../services/services.module';
import { GoogleBooksComponent } from './google-books/google-books.component';
import { MaterialElevationDirective } from './elevation/elevation.directive';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { ComponentsRoutingModule } from './components-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        CommonModule,
        ServicesModule,
        InfiniteScrollModule,
        MatCardModule,
        MatButtonModule,
        ComponentsRoutingModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatSnackBarModule
    ],
    exports: [GoogleBooksComponent, InfiniteScrollComponent],
    declarations: [GoogleBooksComponent, MaterialElevationDirective, InfiniteScrollComponent],
    providers: [
    ]
})
export class ComponentsModule {
}