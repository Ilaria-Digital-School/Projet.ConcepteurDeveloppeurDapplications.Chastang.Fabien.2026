import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';
import { Tooltip } from '../tooltip/tooltip';
import { Common } from '../../constants/common';

const PLACEHOLDER_FULL_DESC = `$$Titre 1
Paragraphe 1.1
Paragraphe 1.2
...
$$Titre 2
Paragraphe 2.1
...`;

const HELP_HTML = `
<p>
  Les champs marqués d'une étoile (<span style="color: red; padding: 0 3px">*</span>) sont
  obligatoires.
</p>
<p>Lors de la rédaction de la description détaillée :</p>
<ul>
  <li>
    Pour les titres et paragraphes, chaque saut de ligne termine un tire ou un paragraphe,
    et commence un autre titre ou paragraphe.
  </li>
  <li>Pour définir un titre, commencez ce titre par la séquence de caractère « $$ ».</li>
  <li>
    Les sauts de ligne surnuméraires sont ignorés lors de l'affichage de la description
    détaillée.
  </li>
</ul>
`;

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, Tooltip],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  // Native classes / Application services
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  // Class properties
  productId!: string | null;
  isEditMode!: boolean;
  title!: string;
  btnAction!: string;
  product: Product = new Product();
  productIni: Product = new Product();
  valuesChange: boolean = false;
  productPrice: string = '';
  productStock: string = '';
  productInfo: string = '';
  placeholderFullDesc: string = PLACEHOLDER_FULL_DESC;
  helpHTML: string = HELP_HTML;

  // Initialize the form /////////////////////////////////////////////////

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = this.productId ? true : false;

    if (this.isEditMode) {
      // Edit mode: retrieve the product by its ID
      this.title = 'Mise à jour';
      this.btnAction = 'Modifier';

      this.productService.getProductById(this.productId).subscribe({
        next: (res: Product) => {
          this.product = res;
          this.productIni = res;
          this.productPrice = Common.numberToString(this.productIni.price);
          this.productStock = typeof this.productIni.stock === 'number' ? this.productIni.stock.toString() : '0';
          this.productInfo = typeof this.productIni.info === 'string' ? this.productIni.info : '';
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

  // Form verification ///////////////////////////////////////////////////

  // Check the minimum length
  errorMinlength(value: string, minlen: number): boolean {
    const RE = new RegExp('(.{0,}\\S.{0,}){' + minlen + ',}');
    return typeof value === 'string' && !RE.test(value);
  }

  // Check the maximum length
  warningMaxlength(value: string, maxlen: number): boolean {
    return typeof value === 'string' && value.length === maxlen;
  }

  // Check the price
  errorPrice(): boolean {
    const PRICE = Number(this.productPrice.replace(',', '.'));
    const ERROR = isNaN(PRICE) || PRICE <= 0 || PRICE >= 10000;
    if (!ERROR) this.product.price = PRICE;
    return ERROR;
  }

  formatPrice() {
    if (!this.errorPrice()) this.productPrice = Common.numberToString(this.product.price);
  }

  // Check the price
  errorStock(): boolean {
    const STOCK = Number(this.productStock);
    const ERROR = isNaN(STOCK) || Math.floor(STOCK) !== STOCK || STOCK < 0 || STOCK >= 10000;
    if (!ERROR) this.product.stock = STOCK;
    return ERROR;
  }

  // IMPORTANT: this method is called whenever the page (component) is modified, not just the form
  // Used only by edit mode: to manage enabling or disabling the form's 'edit' button, prefer a
  // Reactive form over a Template-Driven Form (TDF)
  ngDoCheck() {
    if (this.isEditMode && !this.errorPrice()) {
      this.valuesChange =
        this.product.name.trim() !== this.productIni.name ||
        this.product.description.trim() !== this.productIni.description ||
        this.product.price !== this.productIni.price ||
        this.product.stock !== this.productIni.stock ||
        this.product.img.trim() !== this.productIni.img ||
        this.product.fullDescription.trim() !== this.productIni.fullDescription ||
        this.productInfo.trim() !== this.productIni.info;
    }
  }

  // Edit mode: to notify of a change
  hasChanged(): boolean {
    return this.valuesChange;
  }

  // Actions /////////////////////////////////////////////////////////////

  // Add or update the product
  submit(productForm: NgForm) {
    const PRODUCT = new Product();
    Object.assign(PRODUCT, this.product);

    const FORM_VAL = productForm.value;
    PRODUCT.name = FORM_VAL.productName.trim();
    PRODUCT.description = FORM_VAL.description.trim();
    PRODUCT.price = Number(FORM_VAL.price.replace(',', '.'));
    PRODUCT.img = FORM_VAL.productImg.trim();
    PRODUCT.fullDescription = FORM_VAL.fullDescription.trim();
    PRODUCT.stock = Number(FORM_VAL.stock);
    PRODUCT.info = FORM_VAL.info.trim();

    if (this.isEditMode) {
      // Update the product
      this.productService.updateProduct(PRODUCT).subscribe({
        next: (res: Product) => {
          this.router.navigate(['/dashboard-product']);
        },
        error: (err: any) => {
          alert("Une erreur s'est produite lors de la modification.");
          console.log(err);
        },
      });
    } else {
      // Add the product
      this.productService.addProduct(PRODUCT).subscribe({
        next: (res: Product) => {
          this.router.navigate(['/product-view', res.id]);
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
    if (this.isEditMode) {
      Object.assign(this.product, this.productIni);
      this.productPrice = Common.numberToString(this.productIni.price);
      this.productStock = typeof this.productIni.stock === 'number' ? this.productIni.stock.toString() : '0';
      this.productInfo = typeof this.productIni.info === 'string' ? this.productIni.info : '';
    } else {
      productForm.resetForm();
    }
  }
}
