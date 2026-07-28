import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Main } from '../../../../src/main';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private activatedRoute = inject(ActivatedRoute);

  isEditMode!: boolean;
  products: any[] = [];
  productId!: number;
  btnAction!: string;

  productIni!: any;
  product = {
    id: 0,
    name: '',
    description: '',
    price: '',
    img: '',
    info: '',
    isVisible: true,
  };

  ngOnInit(): void {
    this.products = JSON.parse(localStorage.getItem('products') || '[]');
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isEditMode = this.productId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the product by its ID
      this.btnAction = 'Modifier';
      this.product = this.products.find((item: any) => (item.id = this.productId));
      this.productIni = structuredClone(this.product);
    } else {
      this.btnAction = 'Ajouter';
    }
  }

  submit(productForm: NgForm): void {
    if (!this.isEditMode) {
      // New product: add the product ID and push the new product to the product list
      this.product.id = Date.now();
      this.products.push(this.product);
    }

    // Save the product to local storage
    localStorage.setItem('products', JSON.stringify(this.products));

    // Display a confirmation message
    alert(this.isEditMode ? 'Le produit a été modifié.' : 'Le produit a été ajouté.');
    if (!this.isEditMode) productForm.resetForm();
  }

  reset(productForm: NgForm): void {
    if (this.isEditMode)
      this.product = structuredClone(this.productIni);
    else
      productForm.resetForm();
  }

  checkPrice(): void {
    this.product.price = Main.checkPositiveNumber(this.product.price, false, 9999.99);;
  }
}
