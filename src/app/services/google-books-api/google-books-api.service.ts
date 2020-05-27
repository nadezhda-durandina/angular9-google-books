import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleBooksResult, GoogleBookItem, BookItem, BookItemsResult } from './google-books-api.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageMap } from '@ngx-pwa/local-storage';

const googleBooksApi = 'https://www.googleapis.com/books/v1/volumes';

@Injectable()
export class GoogleBooksService {

  constructor(private http: HttpClient, private storageMap: StorageMap) {
  }

  getFavoritesBooks(): Observable<Map<string, BookItem>> {
    return this.storageMap.get('favorites').pipe(
      map((data) => {return data ? (<Map<string, BookItem>>data) : new Map<string, BookItem>()})
    );
  }

  getControlValue(key: string) {
    return this.storageMap.get(key);
  }

  saveControlValue(key: string, value: any) {
    return this.storageMap.set(key, value);
  }

  clearControlValue(key: string) {
    return this.storageMap.delete(key);
  }

  saveFavoriteBooks(favoritesBooks: Map<string, BookItem>) {
    return this.storageMap.set('favorites', favoritesBooks);
  }

  private prebuildModelResult(data: GoogleBooksResult, favoritesBooks: Map<string, BookItem>): BookItemsResult {
    const booksResult: BookItemsResult = {
      totalItems: 0
    };
    booksResult.totalItems = data.totalItems;
    booksResult.items = data.items ? this.prebuildModelBookItems(data.items, favoritesBooks) : [];
    return booksResult;
  }

  private prebuildModelBookItems(items: GoogleBookItem[], favoritesBooks: Map<string, BookItem>): BookItem[] {
    return items.map((item: GoogleBookItem) => {
      const book: BookItem = {
        id: '',
        image: '',
        title: '',
        favorite: false
      };
      book.title = item.volumeInfo && item.volumeInfo.title ? item.volumeInfo.title : "Unknown";
      book.id = item.id;
      book.favorite = favoritesBooks.has(item.id);
      book.image = item.volumeInfo && item.volumeInfo.imageLinks 
                          && item.volumeInfo.imageLinks.thumbnail ? item.volumeInfo.imageLinks.thumbnail : '/assets/no_image.gif';
      book.pdf = item.accessInfo && item.accessInfo.pdf 
                          && item.accessInfo.pdf.isAvailable ? item.accessInfo.pdf.downloadLink : undefined;
      book.preview = item.volumeInfo && item.volumeInfo.previewLink ? item.volumeInfo.previewLink : undefined;
      book.authors = item.volumeInfo && item.volumeInfo.authors
                          && item.volumeInfo.authors.length ? item.volumeInfo.authors.join(', ') : undefined;              
      return book;
    });
  }

  SearchBooks(search: string, limit: number, offset: number, favoritesBooks: Map<string, BookItem>): Observable<BookItemsResult> {
    const encodedURI  = encodeURI(`${googleBooksApi}?q=inauthor:${search},intitle:${search}&maxResults=${limit}&startIndex=${offset}`)
    return this.http.get<GoogleBooksResult>(encodedURI).pipe(
      map((data: GoogleBooksResult) => this.prebuildModelResult(data, favoritesBooks))
    );
  }
}
