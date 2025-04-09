import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'products', 
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent) 
  },
  { 
    path: 'products/add', 
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) 
  },
  { 
    path: 'products/edit/:id', 
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent) 
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' }
];
