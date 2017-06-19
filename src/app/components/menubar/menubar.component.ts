
import { Component, OnInit } from '@angular/core';
import { menu } from './menu';
import { menuItem } from './menu';
import { Utility} from '../../lib/utility';
import { ReadFileOrUrl} from '../../lib/readFileOrUrl';
import { Message} from '../../lib/message';
import { MessageBus} from '../../lib/messageBus';
import { menuItemOpenFile } from '../menubar/menuItems/menuItemOpenFile';
import { menuItemOpenImage } from '../menubar/menuItems/menuItemOpenImage';
import { menuItemNewImage } from '../menubar/menuItems/menuItemNewImage';

import { ProjectService } from '../../shared/project.service';

import { SomeTestFuncs} from '../../lib/someTestFuncs'

import { Callback } from '../../lib/callback';
import { CmdZoom } from '../../shared/commands/cmdZoom';
import { CmdTestSomeThing } from '../../shared/commands/cmdTestSomeThing';
import { CmdNewLayer } from '../../shared/commands/cmdNewLayer';


@Component({
  selector: 'menubar-component',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {
  public menus: menu [];
  private projectService: ProjectService;
  constructor(projectService: ProjectService ) {
    this.projectService  = projectService;
    this.menus = [];

    let menuFile = new menu("File");
    menuFile.childs.push(new menuItemNewImage(projectService));
    menuFile.childs.push(new menuItemOpenImage(projectService));
    this.menus.push(menuFile);

    let divider = new menuItem('divider',undefined);
    divider.isDivider = true;




    let menuEdit = new menu("Edit");
    menuEdit.childs.push(new menuItem("Cut",new Callback(this.notImplementedYet)));
    menuEdit.childs.push(new menuItem("Copy",new Callback(this.notImplementedYet)));
    menuEdit.childs.push(new menuItem("Paste",new Callback(this.notImplementedYet)));
    menuEdit.childs.push(new menuItem("Delete",new Callback(this.notImplementedYet)));
    this.menus.push(menuEdit);

    let menuView = new menu("View");

    menuView.childs.push(new menuItem("Zoom in",new Callback(()=>{ this.zoomIn()})));
    menuView.childs.push(new menuItem("Zoom out",new Callback(()=>{this.zoomOut()})));
    menuView.childs.push(new menuItem("Zoom fit",new Callback(this.notImplementedYet)));
    menuView.childs.push(new menuItem("Zoom fitH",new Callback(this.notImplementedYet)));
    menuView.childs.push(new menuItem("Zoom fitW",new Callback(this.notImplementedYet)));
    menuView.childs.push(new menuItem("Zoom fitW",new Callback(this.notImplementedYet)));
    menuView.childs.push(divider);
    this.menus.push(menuView);


    let menuImage = new menu("Image");

    menuImage.childs.push(new menuItem("Resize",new Callback((this.notImplementedYet))));    
    
    this.menus.push(menuImage);



    let menuLayers = new menu("Layer");
    menuLayers.childs.push(new menuItem("New",new Callback(()=>{this.newLayer()})));
    menuLayers.childs.push(new menuItem("New from selection",new Callback(this.notImplementedYet)));
    menuLayers.childs.push(new menuItemOpenImage(projectService,"New from a file",false));
    this.menus.push(menuLayers);



    let menuHelp = new menu("Help");
    menuHelp.childs.push(new menuItem("About",new Callback(this.showAbout)));
    this.menus.push(menuHelp);


        let menuTest = new menu("Test");
    menuTest.childs.push(new menuItem("Test Something",new Callback(()=>{this.testSomeThingClicked();})));
    this.menus.push(menuTest);



   }

  ngOnInit() {
  }

  testSomeThingClicked(){

     // MessageBus.publish(Message.ShowError,{msg:'hamza'});
     let cmd = new CmdTestSomeThing('ba',this.projectService);
     cmd.executeAsync();
  }

  notImplementedYet(){
    MessageBus.publish(Message.ShowError,{msg:'not implemented yet'});
  }

  showAbout(){
      MessageBus.publish(Message.ShowAbout,undefined);
  }
  zoomIn(){
    let cmd = new CmdZoom(CmdZoom.In,this.projectService);
    cmd.executeAsync();
  }

  zoomOut(){
    let cmd = new CmdZoom(CmdZoom.Out,this.projectService);
    cmd.executeAsync();
  }
  newLayer(){
    let cmd = new CmdNewLayer(this.projectService);
    cmd.executeAsync();
  }

   newLayerFromAFile(){
    let cmd = new CmdNewLayer(this.projectService);
    cmd.executeAsync();
  }

}




