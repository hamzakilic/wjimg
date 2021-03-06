import { CmdShowError } from './commands/cmdShowError';
import { FileData } from './entities/fileData';
import { ReadFileOrUrl } from './lib/readFileOrUrl';
import { ProjectService } from './services/project.service';
import { CmdExecuteImageAlgorithms } from './commands/cmdExecuteImageAlgorithms';
import { Component, AfterViewInit } from '@angular/core';
import { CheckBrowserCapabilities } from './lib/checkBrowserCapabilities';
import { KeyboardService } from './services/keyboard.service';
import { AppService } from './services/app.service';
import { MessageBus } from './lib/messageBus';
import { Message } from './entities/message';
import { Callback } from './lib/callback';
import { CmdShowFormSampleImages} from './commands/cmdShowFormSampleImages';
import { CmdReadImageFromBufferorUrl } from './commands/cmdReadImageFromBufferorUrl';
import { AlertItem } from './entities/alertItem';
import { ShapesService } from './services/shapes.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';
  isBrowserOk: boolean;
  private _appservice:AppService;
  private _projectService:ProjectService;
  constructor(keyboardService: KeyboardService,appService: AppService,projectService:ProjectService,shapeService:ShapesService) {
    this.isBrowserOk = CheckBrowserCapabilities.isOk();
    this._appservice=appService;
    this._projectService=projectService;
     window.addEventListener('beforeunload',(e)=>{
      let msg="Ayrılmak İstediğinize eminmisiniz";
      e.returnValue=msg;
      return msg;
    }) 
     
    this.setWindowDragAndDrop();
         
   
  


   
  }

  ngOninit(){
      
  }
  ngAfterViewInit(){
    let cmd=new CmdShowFormSampleImages(true);
    cmd.executeAsync();
    if(!CheckBrowserCapabilities.isChrome()){
      this._appservice.showAlert(new AlertItem('warning','Chrome is the fastest browser for this application',8000));
    }
  }

  private setWindowDragAndDrop(){
   
    window.addEventListener("dragover",(evt)=>{
      evt.preventDefault();
    });

    window.addEventListener('drop',(evt)=>{     
      
     evt.preventDefault();
     try{
       
       if(evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length>=1){
         let file=evt.dataTransfer.files[0];
         let fileName=evt.dataTransfer.files[0].name;
         ReadFileOrUrl.readAsync(file, 2,   Callback.from((data) => { this.onSuccess(data) }),
         Callback.from((err) => this.onError(err)),
         Callback.from((data) => this.onProgress(data)));

       }


     }catch(err){
       console.log(err);
     }


    },false);
  }
  onProgress(data: any): void {

  }

  onSuccess(data: FileData) {

    let cmd = new CmdReadImageFromBufferorUrl(data.result, data.fileName,this._appservice, this._projectService, true);
    cmd.executeAsync();

  }
  onError(err: string) {
    let cmd = new CmdShowError(err);
    cmd.executeAsync();
  }
    
  


}
