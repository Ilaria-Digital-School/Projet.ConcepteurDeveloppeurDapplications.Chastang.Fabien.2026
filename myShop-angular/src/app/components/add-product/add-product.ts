import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../../main';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  // Initialize the form /////////////////////////////////////////////////

  productId!: string | null;
  isEditMode!: boolean;
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
        next: (res: Product) => {
          Object.assign(this.product, res);
          Object.assign(this.productIni, res);
          this.changeDetectorRef.detectChanges(); // Force a check
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    } else {
      // Add a new product
      this.title = 'Nouvel Article';
      this.btnAction = 'Ajouter';
    }
  }

  // Actions /////////////////////////////////////////////////////////////

  // Add or update the product
  submit(productForm: NgForm): void {
    if (this.isEditMode) {
      // Update the product
      this.productService.updateProduct(this.product).subscribe({
        next: (res: Object) => {
          alert('Le produit a été modifié.');
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la modification.");
          console.log(err);
        },
      });
    } else {
      // Add the product
      this.productService.addProduct(productForm.value).subscribe({
        next: (res: Object) => {
          alert('Le produit a été ajouté.');
          productForm.resetForm();
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de l'ajout.");
          console.log(err);
        },
      });
    }
  }

  // Reset the form
  reset(productForm: NgForm): void {
    if (this.isEditMode) this.product = structuredClone(this.productIni);
    else productForm.resetForm();
  }

  // Check the price
  checkPrice(): void {
    let value = this.product.price
      .toString()
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    let nvalue = Math.round(100 * parseFloat(value)) / 100;
    this.product.price = nvalue > 0 ? (nvalue <= 9999.99 ? nvalue : 9999.99) : 0;
  }
}
