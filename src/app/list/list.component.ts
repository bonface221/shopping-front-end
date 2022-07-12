import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  title = 'frontend';
  items!: any;
  error: any;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getShoppingItems().subscribe({
      next: (res) => (this.items = res),
      error: (err: any) => console.log(err),
    });
  }
  add(itemName: string, itemQuantity: string) {
    this.api.createShoppingItems(itemName, parseInt(itemQuantity)).subscribe({
      next: (item) => this.items.unshift(item),
      error: (err) => console.log(err),
    });
  }
  delete(id: number) {
    this.api.deleteShoppingItem(id).subscribe({
      next: (success) =>
        this.items.splice(
          this.items.findIndex((item: any) => item.id === id),
          1
        ),
    });
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRefresh');
    localStorage.removeItem('expires_at');

    this.router.navigate(['login']);
  }
}
