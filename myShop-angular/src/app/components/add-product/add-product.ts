import { ChangeDetectorRef, Component, inject, SimpleChanges } from '@angular/core';
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
  valuesChange: boolean = false;

  ngOnInit() {
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
          this.changeDetectorRef.detectChanges(); // Asynchrone process: force a check
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    } else {
      // Add a new product
      this.title = 'Nouvel Article';
      this.btnAction = 'Ajouter';
      this.valuesChange = true;
    }
  }

  // Edit mode
  // IMPORTANT: this method is called whenever the page (component) is modified, not just the form
  ngDoCheck() {
    if (this.isEditMode) {
      this.valuesChange =
        this.product.name !== this.productIni.name ||
        this.product.description !== this.productIni.description ||
        this.product.price.toString() !== this.productIni.price.toString() ||
        this.product.img !== this.productIni.img ||
        this.product.fullDescription !== this.productIni.fullDescription ||
        this.product.info !== this.productIni.info;
    }
  }

  // Edit mode: to notify of a change
  hasChanged() {
    return this.valuesChange;
  }

  // Actions /////////////////////////////////////////////////////////////

  // Add or update the product
  submit(productForm: NgForm) {
    const PRODUCT = structuredClone(this.product);

    // Remove these properties before saving
    PRODUCT.cartQuantity = undefined;
    PRODUCT.additional = undefined;

    const FORM_VAL = productForm.value;
    PRODUCT.name = FORM_VAL.productName;
    PRODUCT.description = FORM_VAL.description;
    PRODUCT.price = FORM_VAL.price;
    PRODUCT.img = FORM_VAL.productImg;
    PRODUCT.info = FORM_VAL.info;
    PRODUCT.fullDescription = FORM_VAL.fullDescription;

    if (this.isEditMode) {
      // Update the product
      this.productService.updateProduct(PRODUCT).subscribe({
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
      this.productService.addProduct(PRODUCT).subscribe({
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
  reset(productForm: NgForm) {
    this.product = structuredClone(this.productIni);
  }

  // Check the price
  errorPrice(price: string) {
    const PRICE = parseFloat(price);
    return isNaN(PRICE) || PRICE <= 0 || PRICE >= 10000;
  }
}
