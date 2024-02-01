import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-review-button',
  templateUrl: './add-review-button.component.html',
  styleUrls: ['./add-review-button.component.css']
})
export class AddReviewButtonComponent {

  constructor(private confirmationService: ConfirmationService) { }



  addReview() { 
    this.confirmationService.confirm({ 
        message: 'Deleting account will remove all reviews and data associated with your student email', 
        header: 'Are you sure you wish to proceed?', 
        icon: 'pi pi-exclamation-triangle'
    }); 



} 

}
