import { Component,OnInit } from '@angular/core';
import {ProfPageData, ProfessorService} from "src/app/PageDataService/professor.service";

@Component({
  selector: 'app-prof-contact',
  templateUrl: './prof-contact.component.html',
  styleUrls: ['./prof-contact.component.css']
})
export class ProfContactComponent implements OnInit {

  public email: string = ""
  public phone: string = "";
  public office: string = "";
  public educationDetails: string[] = [];
   constructor(private prof: ProfessorService) {
    }

    ngOnInit() {

    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
          if (data) {
            if(data.email){

                 this.email = data.email;

            }else{
               this.email = "Not Available";
            }
           if(data.phone){

              this.phone = data.phone;

                }else{
                   this.phone = "Not Available";
                 }

            if (data.education){

                if (data.education.length === 0) {
              this.educationDetails[0]  = "Not Available";
                }

              else{
                  this.educationDetails = data.education;
              }

            }

            if(data.office){

                        this.office = data.office;

                       }else{
                       this.office = "Not Available";
                       }


          }

          //Communciate skeleton
        })

    }


  }
