import { Component, OnInit } from '@angular/core';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { IDiscountResponse } from '../../../app/shared/interfaces/discount/discount.interface';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  public userDiscount: Array<IDiscountResponse> = [];

  constructor(
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    this.getDiscounts();
  }

  getDiscounts(): void {
    this.discountService.getAll().subscribe(data => {
      this.userDiscount = data;
    });
  }
}
