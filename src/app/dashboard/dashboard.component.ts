import { Component, ViewChild } from '@angular/core';
import { ContentComponent } from './content/content.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

  @ViewChild(ContentComponent) childComponent: ContentComponent;


  //  event receptor when triggered from child (navbar)
  updateComponent(value: [String, String]) {
    this.childComponent.childFunction(value);  // passing the value to child (component)
  }
}
