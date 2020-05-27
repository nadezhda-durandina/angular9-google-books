import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { GoogleBooksService } from './google-books-api/index'

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    providers: [
        GoogleBooksService
    ]
})
export class ServicesModule {
}
