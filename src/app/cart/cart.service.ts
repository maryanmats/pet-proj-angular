import { computed, Injectable, signal } from '@angular/core';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));

  cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));

  cartTax = computed(() => this.cartSubTotal() * 0.08);

  cartTotal = computed(() => this.cartSubTotal() + this.cartTax());

  addProduct(product: Product): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === product.id);
    if (indexFound >= 0) {
      this.cartItems.mutate((items) => items[indexFound].quantity += 1);
    } else {
      this.cartItems.mutate((items) => items.push({ product, quantity: 1 }));
    }
  }

  updateCartQuantity(cartItem: CartItem): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === cartItem.product.id);
    if (indexFound >= 0) {
      this.cartItems.mutate((items) => items[indexFound] = cartItem);
    }
  }

  removeProduct(product: Product): void {
    this.cartItems.update((items) => items.filter((p) => p.product.id !== product.id));
  }

}
