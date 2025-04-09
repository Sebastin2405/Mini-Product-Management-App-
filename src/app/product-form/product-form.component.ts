import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ProductService } from '../shared/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup;
  categories: string[] = [];
  isEditMode = false;
  productId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ){

  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();

    // const id = this.route.snapshot.paramMap.get('id');
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      imageFile: [null]
    });

    this.productForm.get('image')?.valueChanges.subscribe(url => {
      if (!this.selectedFile && url) {
        this.imagePreview = url;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({ 
          image: 'assets/images/uploaded-image.jpg' 
        });
      };
      reader.readAsDataURL(file);
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe(product => {
      this.productForm.patchValue(product);
      this.imagePreview = product.image;
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    const productData: Product = {
      id: this.productId || undefined,
      title: this.productForm.value.title,
      price: this.productForm.value.price,
      description: this.productForm.value.description,
      category: this.productForm.value.category,
      image: this.imagePreview?.toString() || 'assets/images/userimage.jp'
    };
  
    const operation = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.addProduct(productData);
  
    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${this.isEditMode ? 'updated' : 'added'} successfully`
        });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Operation failed:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.isEditMode ? 'update' : 'add'} product`
        });
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.productForm.controls).forEach((control:any) => {
      control.markAsTouched();
    });
  }

  backtoList(){
    this.router.navigate(['/products']);
  }

}
