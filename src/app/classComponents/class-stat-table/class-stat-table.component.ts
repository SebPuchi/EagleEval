import { Component,OnInit } from '@angular/core';
import {ProfTableData,ClassService} from "src/app/PageDataService/class.service";

@Component({
  selector: 'app-class-stat-table',
  templateUrl: './class-stat-table.component.html',
  styleUrls: ['./class-stat-table.component.css']
})
export class ClassStatTableComponent implements OnInit{

  public crsovlandprimeknob: number = 10;

   ngOnInit() {
   console.log("hellow");
   }

}
