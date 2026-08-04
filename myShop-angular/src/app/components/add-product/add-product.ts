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
  productId!: string | null;
  title!: string;
  btnAction!: string;
  product: Product = new Product();
  productIni: Product = new Product();

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = this.productId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the product by its ID
      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';
      this.productService.getProductById(this.productId).subscribe({
        next: (res: Object) => {
          Object.assign(this.product, res);
          this.productIni = structuredClone(this.product);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
      console.log(this.product.id);
    } else {
      this.title = 'Nouvel Article';
      this.btnAction = 'Ajouter';
    }
  }

  submit(productForm: NgForm): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product).subscribe({
        next: (res: Object) => {
          alert('Le produit a été modifié.');
        },
        error: (err: any) => {
          alert("Une erreur s'est produite.");
          console.log(err);
        },
      });
    } else {
      this.productService.addProduct(productForm.value).subscribe({
        next: (res: Object) => {
          alert('Le produit a été ajouté.');
          productForm.resetForm();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite.");
          console.log(err);
        },
      });
    }
  }

  reset(productForm: NgForm): void {
    if (this.isEditMode) this.product = structuredClone(this.productIni);
    else productForm.resetForm();
  }

  checkPrice(): void {
    this.product.price = Number(
      Main.checkPositiveNumber(this.product.price.toString(), false, 9999.99),
    );
  }
}
