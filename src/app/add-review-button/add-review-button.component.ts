import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-add-review-button',
  templateUrl: './add-review-button.component.html',
  styleUrls: ['./add-review-button.component.css']
})
export class AddReviewButtonComponent {

  professorName: string = "Jermery Wilkins";


  constructor(private confirmationService: ConfirmationService) { }


  addReview() { 
    this.confirmationService.confirm({ 
        message: 'Deleting account will remove all reviews and data associated with your student email', 
        header: 'Review for '+ this.professorName,
        
    }); 



  } 

}
