import { Component,OnInit } from '@angular/core';
import {ProfTableData,ClassService} from "src/app/PageDataService/class.service";

@Component({
  selector: 'app-class-stat-table',
  templateUrl: './class-stat-table.component.html',
  styleUrls: ['./class-stat-table.component.css']
})
export class ClassStatTableComponent implements OnInit{

profData: ProfTableData[] = [];




    constructor(private classname: ClassService) {}

  ngOnInit() {
       this.classname.getprofTableData().subscribe((data: ProfTableData[] | null) => {
         if (data) {
           this.profData = data;

           // Replace -1 with 'NaN' in effort_hours

         }
       });




     }
}
