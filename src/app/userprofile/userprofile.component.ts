import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {

  constructor(private confirmationService: ConfirmationService) { }


    removeAccount() { 
      this.confirmationService.confirm({ 
          message: 'Deleting account will remove all reviews and data associated with your student email', 
          header: 'Are you sure you wish to proceed?', 
          icon: 'pi pi-exclamation-triangle'
      }); 



  } 

  removeReview() { 
    this.confirmationService.confirm({ 
        message: 'Deleting a review is an irreversible action', 
        header: 'Are you sure you wish to proceed?', 
        icon: 'pi pi-exclamation-triangle'
    }); 

} 




}
