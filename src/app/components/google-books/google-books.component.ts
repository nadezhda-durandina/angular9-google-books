import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { GoogleBooksService, BookItem } from '../../services/google-books-api';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {forkJoin} from 'rxjs';

const pageSize: number = 36;

@Component({
  selector: 'app-google-books',
  templateUrl: './google-books.component.html',
  styleUrls: ['./google-books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoogleBooksComponent implements OnInit {
  googleBooks: FormGroup;
  search = new FormControl();
  favorite = new FormControl(false);
  items: BookItem[] = [];
  private totalItems: number = -1;
  loadingPage: boolean = false;
  favoritesBooks: Map<string, BookItem>;
  myLibrary: boolean = false;
  private currentSearch: string;

  ngOnInit() {}

  constructor(fb: FormBuilder, private googleBooksService: GoogleBooksService, private changeDetectorRef: ChangeDetectorRef) {
    this.googleBooks = fb.group({
      search: this.search,
      favorite: this.favorite
    });
    this.googleBooksService.getFavoritesBooks().subscribe((data) => {
      this.favoritesBooks = data;
    });
    forkJoin(
      this.googleBooksService.getControlValue('search_control'),
      this.googleBooksService.getControlValue('books_favorites_control')
    ).subscribe((results: any[]) => {
      this.search.setValue(results[0]);
      if(results[1] && results[1].length) {
        this.items = results[1];
        this.favorite.setValue(true);
        this.search.disable();
      }
      this.favorite.valueChanges.subscribe((favorite) => {
        if(favorite) {
          this.items = this.items.filter((item: BookItem) => item.favorite);
          this.googleBooksService.saveControlValue('books_favorites_control', this.items).subscribe();
          this.search.disable();
          this.changeDetectorRef.markForCheck();
        } else {
          this.googleBooksService.clearControlValue('books_favorites_control').subscribe();
          this.search.enable();
          this.searchBooks();
        }
      });
      this.changeDetectorRef.markForCheck();
    })
  }

  public hasResult() {
    return this.loadingPage || (this.totalItems > 0 || !this.currentSearch)
  }

  public addFavorite(book: BookItem) {
    if(book.favorite) {
      this.favoritesBooks.delete(book.id);
    } else {
      this.favoritesBooks.set(book.id, book);
    }
    this.googleBooksService.saveFavoriteBooks(this.favoritesBooks).subscribe(() => {
      book.favorite = !book.favorite;
      this.changeDetectorRef.markForCheck();
    })
  }

  public searchBooks() {
    if (this.googleBooks.valid) {
      this.currentSearch = this.search.value;
      this.googleBooksService.saveControlValue('search_control', this.currentSearch).subscribe();
      this.loadingPage = true;
      this.items = [];
      this.getBooks(0);
    }
  }

  public preview(book: BookItem) {
    window.open(book.preview);
  }

  public download(book: BookItem) {
    window.open(book.pdf);
  }

  public onKeyDown(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.searchBooks();
    }
    if (event.keyCode === 27) {
      this.search.setValue(null);
    }
  }

  private getBooks(offset: number) {
    this.googleBooksService.SearchBooks(this.search.value, pageSize, offset, this.favoritesBooks).subscribe((data) => {
      this.items = data.items ? this.items.concat(data.items) : [];
      this.totalItems = data.totalItems;
      this.loadingPage = false;
      this.changeDetectorRef.markForCheck();
    }); 
  }

  public getPage(): void {
    if (this.googleBooks.valid && this.items.length < this.totalItems 
              && this.items.length && !this.favorite.value) {
      this.loadingPage = true;
      this.getBooks(this.items.length);
    }
  }
}
