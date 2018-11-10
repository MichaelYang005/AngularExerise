import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';
//import { expand } from 'rxjs/operators';

import { FeedbackService } from '../services/feedback.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      visibility(),
      flyInOut(),
      expand()
    ]
})



export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  returnedFeedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  feedbackErrMess: string;
  feedbackcopy: Feedback;
  visibility = 'hidden';
  newfeedback: Feedback;

  showSpinner: boolean;
  showForm: boolean;
  showSubmission: boolean;
  
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };


  constructor(private fb: FormBuilder, private feedbackservice: FeedbackService,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
      this.showSpinner = false;
      this.showForm = true;
      this.showSubmission = false;
    }

    submitFeedback() {
      //make sure it passes validation
      if (this.feedbackForm.status == "VALID" ) {
        this.returnedFeedback = null;
        this.showSpinner = true;
        this.showForm = false;
        this.showSubmission = false;
        
        //grab curent newfeedback
        this.newfeedback = this.feedbackForm.value;
        this.feedbackcopy = this.newfeedback;

        this.feedbackservice.postFeedback(this.feedbackcopy)
           .subscribe(feedback => {
             if (feedback) {
                 this.returnedFeedback = feedback; this.feedbackcopy = null;  this.showSpinner = false; this.showForm = false;   this.showSubmission = true;
                 setTimeout (() => {
                  console.log("Hello from setTimeout");
                  this.showForm = true;   this.showSubmission = false
               }, 5000);
             }
           },
           feedbackErrMess => { this.returnedFeedback = null; this.feedback = null; this.feedbackcopy = null; 
            this.showSubmission = false; this.feedbackErrMess = <any>feedbackErrMess; });
     
        this.createForm();
        this.feedbackFormDirective.resetForm();
      }
    }

  ngOnInit() {
    this.showSpinner = false;
    this.showForm = true;
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now


  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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

  
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    
    this.submitFeedback();
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
    
  }
  
}

