import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Main, Product } from '../../../main';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);

  isEditMode!: boolean;
  productId!: number;
  title!: string;
  btnAction!: string;
  products: Product[] = [];
  product:Product = new Product();
  productIni: Product = new Product();

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.products = res.map((item:any) => {
        const PRODUCT = new Product();
        Object.assign(PRODUCT, item);
        return PRODUCT;
      });
    });
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.isEditMode = this.productId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the product by its ID
      this.title = "Mise à jour";
      this.btnAction = 'Modifier';
      const PRODUCT = this.products.find((item: Product) => (item.id = this.productId));
      if (PRODUCT) {
        Object.assign(this.product, PRODUCT)
        this.productIni = structuredClone(this.product);
      }
    } else {
      this.title = "Nouvel Article";
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
    // localStorage.setItem('products', JSON.stringify(this.products));

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
    this.product.price = Number(Main.checkPositiveNumber(this.product.price.toString(), false, 9999.99));
  }
}
