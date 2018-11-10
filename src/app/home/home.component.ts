import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurl';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  BURL: string;
  disherrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService, private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { 
      this.BURL = baseURL;
    }
  

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish, disherrMess => this.disherrMess = <any>disherrMess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, promotionErrMess => this.promotionErrMess = <any>promotionErrMess);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader,leaderErrMess => this.leaderErrMess = <any>leaderErrMess);
  }
}



