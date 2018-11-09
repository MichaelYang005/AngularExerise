
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { Component, OnInit, Inject } from '@angular/core';
import { baseURL } from '../shared/baseurl';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  

  BURL: string;
  //selectedDish: Dish;

  constructor(private dishService: DishService,
    @Inject('BaseURL') private BaseURL) {
      this.BURL = baseURL;
     }


  ngOnInit() {
    this.dishService.getDishes().subscribe(dishes => this.dishes = dishes);
  }

  //onSelect(dish: Dish) {
    //this.selectedDish = dish;
  //}
}
