import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  products: any[] = [];

  product = {
    name: '',
    description: '',
    price: '',
    img: '',
    info: '',
  };

  addProduct(productForm: NgForm) {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
    this.products.push(this.product);
    localStorage.setItem('products', JSON.stringify(this.products));

    alert('Le produit a été ajouté.');
    productForm.resetForm();
  }
}
