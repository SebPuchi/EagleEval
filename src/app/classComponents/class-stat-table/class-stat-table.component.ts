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

            //in my profData, how can I replae all -1 with NaN if for the explains material attributre?
             this.profData.forEach((item) => {
                      item.explains_material = item.explains_material === -1 ? NaN : item.explains_material;
                    });




         }
       });




     }
}
