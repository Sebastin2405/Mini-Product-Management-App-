import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      delay(500),
      tap(() => console.log('Fetched products')),
      catchError(this.handleError)
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      delay(500),
      tap(() => console.log(`Fetched product ${id}`)),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load product details'
        });
        return this.handleError(error);
      })
    );
  }

  addProduct(product: Product): Observable<Product> {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image 
    };
    return this.http.post<Product>(`${this.apiUrl}/products`, payload).pipe(
      tap((newProduct) => {
        console.log(`Added product with id=${newProduct.id}`);
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category
    };
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, payload).pipe(
      tap(() => {
        console.log(`Updated product id=${id}`);
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => {
        console.log(`Deleted product id=${id}`);
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`).pipe(
      delay(500),
      tap(() => console.log('Fetched categories')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
