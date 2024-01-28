import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {

  constructor(private confirmationService: ConfirmationService, 
    private primengConfig: PrimeNGConfig) { }


    Confirm() { 
      this.confirmationService.confirm({ 
          message: 'Proceeding will remove all reviews and data associated with this account', 
          header: 'Remove your Account?', 
      }); 

  } 



}
