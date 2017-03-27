
import { Component, OnInit } from '@angular/core';
import {menu} from './menu';
import {menuItem } from './menu';



import {callback as iskilip_core_callback} from 'iskilip/core/callback';

@Component({
  selector: 'layout-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  menus: menu [];
  constructor() {

    this.menus = [];

    let menuFile = new menu("File");
    menuFile.childs.push(new menuItem("Open File",new iskilip_core_callback(this.openFileClicked)));
    this.menus.push(menuFile);

    let menuTest = new menu("Test");
    menuTest.childs.push(new menuItem("Test Something",new iskilip_core_callback(this.testSomeThingClicked)));
    this.menus.push(menuTest);

   }

  ngOnInit() {
  }

  openFileClicked(){
    alert("openFileClicked");

  }
  testSomeThingClicked(){
    alert("testsomething clicked");
  }

}
