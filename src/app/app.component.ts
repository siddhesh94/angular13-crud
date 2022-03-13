import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './component/dialog/dialog.component';
import { ApiService } from './service/api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular13-crud';
  displayedColumns: string[] = [
    'productName',
    'category',
    'freshness',
    'price',
    'comment',
    'date',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    const dialogRef = this.dialog
      .open(DialogComponent, { width: '30%' })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.apiService.getProduct().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {},
    });
  }

  editProduct(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe({
      next: (res) => {
        this.toast.warning({
          detail: 'Warning Message',
          summary: 'Product deleted successfully',
          duration: 2000,
        });
        this.getAllProducts();
      },
      error: () => {
        this.toast.error({
          detail: 'Error Message',
          summary: 'Error while deleting product',
          duration: 2000,
        });
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
