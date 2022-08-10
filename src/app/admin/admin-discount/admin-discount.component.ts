import { Component, OnInit } from '@angular/core';
import { IDiscount } from 'src/app/shared/interfaces/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {

  public adminDiscounts!: IDiscount[];
  public description!: string;
  public imagePath = 'https://la.ua/wp-content/uploads/2021/08/dn_790_400.jpg';

  public editStatus = false;
  public editId!: number;


  constructor(
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    this.getDiscounts();
  }

  getDiscounts(): void {
    this.adminDiscounts = this.discountService.getDiscount();
  }

  addDiscount(): void {
    const newDiscount = {
      id: 1,
      description: this.description,
      imagePath: this.imagePath
    }
    if (this.adminDiscounts.length > 0) {
      const id = this.adminDiscounts.slice(-1)[0].id;
      newDiscount.id = id + 1;
    }
    this.discountService.addDiscount(newDiscount)
    console.log(this.adminDiscounts);
    this.resetForm();
  }
  editDiscount(discount: IDiscount): void {
    this.description = discount.description;
    this.editStatus = true;
    this.imagePath = discount.imagePath;
    this.editId = discount.id;
  }
  saveDiscount(): void {
    const updateDiscount = {
      id: this.editId,
      description: this.description,
      imagePath: this.imagePath
    }
    this.discountService.updateDiscount(updateDiscount, this.editId);
    this.resetForm();
  }
  deleteDiscount(discount: IDiscount): void {
    if (confirm('Are you sure?')) {
      this.discountService.deleteDiscount(discount.id);
    }
  }

  private resetForm(): void {
    this.description = '';
    this.editStatus = false;
    this.imagePath = 'https://la.ua/wp-content/uploads/2021/08/dn_790_400.jpg';
  }
}
