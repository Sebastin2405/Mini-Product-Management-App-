import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'product-management-app';
  items: MenuItem[] = [
    { label: 'Products', icon: 'pi pi-list', routerLink: '/products', routerLinkActiveOptions: { exact: true }  },
    { label: 'Add Product', icon: 'pi pi-plus', routerLink: '/products/add' }
  ];

  constructor(){}

  ngOnInit(): void {
    
  }
  
}
