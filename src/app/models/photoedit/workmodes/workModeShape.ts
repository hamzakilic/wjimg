
import { AlertItem } from './../../../entities/alertItem';
import { Callback } from './../../../lib/callback';
import { FormResizeComponent } from './../../../components/form-resize/form-resize.component';
import { History } from './../history/history';
import { RadialGradient, LineerGradient } from './../../../lib/draw/gradient';
import { LayerGraphics } from './../layerGraphics';
import { LayerEmpty } from './../layerEmpty';
import { AppService } from './../../../services/app.service';
import { HMath } from './../../../lib/hMath';
import { Polygon } from './../../../lib/draw/polygon';

import { element } from 'protractor';
import { Helper } from './../lib/helper';
import { Point } from './../../../lib/draw/point';
import { Graphics } from './../../../lib/graphics';
import { IWorkspace, WorkModes } from './../iworkspace';
import { WorkModeBrush } from './workModeBrush';
import { WorkModeEdit, EditType } from './workModeEdit';
import { Color } from '../../../lib/draw/color';
import { Layer } from '../layer';
import { LayerSvg } from '../layerSvg';
import { Rect } from '../../../lib/draw/rect';
import { WorkModeBase } from './workModeBase';
import { SvgShape } from '../../../lib/draw/svgShape';

export class WorkModeShape extends WorkModeBase {
    
  private _isMouseDown = false;
  private mouseDownPoint: Point;  
  private shape:SvgShape;
  private layer:Layer;
  constructor(workspace: IWorkspace, appService: AppService) {
    super(workspace, appService, false, true);

    this.workspace.cssClasses = "mouseCross";
    this.workspace.selectionLayer=undefined;
    this.workspace.workLayer = new LayerEmpty("shape layer", this.workspace.width, this.workspace.height);
    this.workspace.workLayer.scale=this.workspace.scale;
   
  }
  public get typeOf(): number {
    return WorkModes.Shapes;
  }
  public get subTypeOf(): string {
    return "";
  }

  public setShape(shape:SvgShape){
    this.shape=shape;
  }

  public mouseMove(event: MouseEvent, scroll: Point) {
    if (this._isMouseDown) {     
      let scaleX=this.shape.viewportW/this.shape.viewportH;
      let point = this.workspace.workLayer.normalizeMouseEvent(event, scroll, true);
      if(point.x<this.mouseDownPoint.x)
      this.layer.setLeft(point.x);
      if(point.y<this.mouseDownPoint.y)
      this.layer.setTop(point.y);
      let width=(point.x-this.mouseDownPoint.x).extAbs();
      let height=(point.y-this.mouseDownPoint.y).extAbs();
      if(width>height)
          height=width/scaleX;
      else {
        width=height*scaleX;
      }
       if(!isNaN(width) && !isNaN(height))
      this.layer.setWidthHeight(width,height);
      this.layer.invalidate();
      
    }


  }


  public mouseDown(event: MouseEvent, scroll: Point) {
    this._isMouseDown = true;
    this.mouseDownPoint = this.workspace.workLayer.normalizeMouseEvent(event, scroll, true);
    this.layer=new LayerSvg(this.shape.name,this.shape.viewportW/this.shape.viewportH,1,this.shape,this.workspace.foregroundColor);
    this.layer.scale=this.workspace.scale;
    this.layer.setLeft(this.mouseDownPoint.x);
    this.layer.setTop(this.mouseDownPoint.y);
        
    this.workspace.layers.push(this.layer);
    this.workspace.makeLayerSelected(this.layer);
    this.layer.invalidate();
    

  }
  public mouseUp(event: MouseEvent, scroll: Point) {    
    this._isMouseDown=false;
    
    let cloned=this.layer.clone();
    let history=History.create().setUndo(Callback.from(()=>{
      let index=this.workspace.layers.findIndex(p=>p.uuid==cloned.uuid);
      if(index>=0)
        this.workspace.layers.splice(index,1);
    }));
    this.workspace.historyManager.add(history,Callback.from(()=>{
      this.workspace.layers.push(cloned.clone());
    }))
  }
}