import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { Product } from '../models/product.model';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    RouterLink,
    ConfirmDialogModule,
    RatingModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchText: string = '';
  selectedCategory: string | null = null;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  deleteProduct(product: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>${product.title}</strong>?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-trash',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== product.id);
        this.productService.deleteProduct(product.id).subscribe({
          error: () => {
            this.loadProducts();
          }
        });
      }
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = null;
    this.filterProducts();
  }
  

}
