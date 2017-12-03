import { ClipboardService, ClipboardData } from './../services/clipboard.service';
import { AppService } from './../services/app.service';
import { LayerImage } from './../models/photoedit/layerImage';
import { ImageAlgorithmCrop } from './../lib/imagealgorithm/imageAlgorithmCrop';
import { Command } from './command';
import { Message } from '../entities/message';
import { MessageBus } from '../lib/messageBus';
import { Constants } from '../lib/constants';

import { ProjectService } from '../services/project.service';
import { Workspace } from '../models/photoedit/workSpace';
import { LayerEmpty } from '../models/photoedit/layerEmpty';

import { HImage } from '../lib/image';
import { LayerSelect } from '../models/photoedit/layerSelect';
import { AlertItem } from '../entities/alertItem';
import { Point } from '../lib/draw/point';
import { Graphics } from '../lib/graphics';
import { Rect } from '../lib/draw/rect';
import { Callback } from '../lib/callback';



export class CmdCopy extends Command {
  zoomType: number;
  projectService: ProjectService;
  appService:AppService;
  clipboardService:ClipboardService;
  constructor(projectService: ProjectService,appService:AppService,clipboardService:ClipboardService) {
    super();

    this.projectService = projectService;
    this.appService=appService;
    this.clipboardService=clipboardService;
  }
  protected execute(): void {
    if (this.projectService.currentProject) {
      let workspace = this.projectService.currentProject.activeWorkspace;
      if (workspace && workspace.layers.length>0) {
           let indexOfSelected=workspace.layers.findIndex((item)=>item.isSelected);
           if(indexOfSelected<0)
               indexOfSelected=0;
           let selectedLayer=workspace.layers[indexOfSelected];
           let selectionLayer=workspace.selectionLayer as LayerSelect;

           if(!selectionLayer){
             //selectionLayer yok ise, bir alan seçili değildi ne yapacağız peki
            return;
           }

           let polygons = selectionLayer.polygons;
           polygons.forEach((poly)=>{
               
               let rect= poly.bounds;
               let translatedPoly=poly.translate(-rect.x,-rect.y);
               let crop=new ImageAlgorithmCrop(rect);
               let cropedImage =crop.process(selectedLayer.getImage());
              
               let canvas=document.createElement('canvas');
               canvas.width=cropedImage.width;
               canvas.height=cropedImage.height;
               let graphics=new Graphics(canvas,canvas.width,canvas.height,1);
               graphics.save();
               graphics.drawPolygon(translatedPoly,false);
               graphics.clip();
               graphics.drawImageRect(cropedImage,new Rect(0,0,canvas.width,canvas.height),new Rect(0,0,canvas.width,canvas.height),new Callback(()=>{
              
                //this is inside of 
                graphics.restore();
                let maskedImage= graphics.getImage();
                graphics.dispose();
                this.clipboardService.add(new ClipboardData(ClipboardData.Types.Image,maskedImage));
                this.appService.showAlert(new AlertItem('info','Copied',2000));
                canvas=null;
                //let newLayer=new LayerImage(maskedImage,'copy');
                //workspace.addLayer(newLayer);

               }));
               
               
           });

      }
    }

  }




}
