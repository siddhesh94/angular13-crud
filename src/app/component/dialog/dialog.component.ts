import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand new', 'Second hand', 'Refurbished'];
  actionBtn: string = 'Save';
  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toast: NgToastService,
    private dialog: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }
  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.apiService.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.toast.success({
              detail: 'Success Message',
              summary: 'Product added successfully',
              duration: 2000,
            });
            this.productForm.reset();
            this.dialog.close('save');
          },
          error: () => {
            this.toast.error({
              detail: 'Error Message',
              summary: 'Error while adding product',
              duration: 2000,
            });
          },
        });
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct() {
    this.apiService
      .putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.toast.info({
            detail: 'Info Message',
            summary: 'Product updated successfully',
            duration: 2000,
          });
          this.productForm.reset();
          this.dialog.close('update');
        },
        error: () => {
          this.toast.error({
            detail: 'Error Message',
            summary: 'Error while updating product',
            duration: 2000,
          });
        },
      });
  }
}
