import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  newcomment: Comment;
  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'maxlength':     'Last Name cannot be more than 100 characters long.'
    },
  };



  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, private fb: FormBuilder) { 
      this.createForm();
    }

    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating: [5],
        comment: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)] ],
      });
  
      this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      this.newcomment = this.commentForm.value;
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishservice
        .getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds
        .length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds
        .length];
    }

    onSubmit() {
      //make sure it passes validation
      if (this.commentForm.status == "VALID" ) {
        //grab curent comment
        this.newcomment = this.commentForm.value;
        //set date
        var d = new Date();
        var commentDate = d.toISOString();
        this.newcomment.date = commentDate;
         //add to array
        this.dish.comments.push(this.newcomment);
        //console.log(this.newcomment);
      
        this.createForm();
        this.commentFormDirective.resetForm();
      }
    }
  
    goBack(): void {
      this.location.back();
    }
}


