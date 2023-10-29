import { Component } from '@angular/core';

@Component({
  selector: 'app-score-knob',
  templateUrl: './score-knob.component.html',
  styleUrls: ['./score-knob.component.css']
})
export class ScoreKnobComponent {

  value: number = 0;
  isDisabled: boolean = true;

  Constructor(){


  }

}
