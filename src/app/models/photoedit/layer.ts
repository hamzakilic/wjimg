import { Point } from './../../lib/draw/point';
import { Color } from './../../lib/draw/color';
import { debuging} from '../../debuging'
import { Callback } from '../../lib/callback';
import { HImage } from '../../lib/image';
import { Graphics } from '../../lib/graphics';
import { SurfaceCanvas } from './surface'
import { Rect } from '../../lib/draw/rect';

import { RotationHelper, RotationMove } from './lib/rotationHelper';
import { Utility } from '../../lib/utility';

export abstract class Layer extends SurfaceCanvas {
  private _name: string;
  public isHidden: boolean;
  public isSelected: boolean;
  public showSelected:boolean;
  public canResizeOrRotate:boolean;
  public canRotate: boolean;
  protected _mouseDownPoint: MouseDownPoint;
  public isMouseDown: boolean;
  public _blendMode:string;
  private _uuid:string;
  
  public htmlElement:any;
  constructor(name?: string) {
    super();
    this.sourceMask = undefined;
    this._blendMode="normal";
    if (name)
      this._name = name.replace(/[\(\)]/g,'_').substring(0,10);
    else this._name = 'layer';
    this.isHidden = false;
    this._mouseDownPoint = new MouseDownPoint();
    this.showSelected=true;
    this.canResizeOrRotate=true;
    this.cssNotSelectedClass={ clayerEmpty:true};
    this.cssSelectedClass={ clayerSelected:true };
    this._uuid=Utility.uuid();
  }

  private cssSelectedClass:any;//durmadan değişiklik oluyor diye değişken yapıldı
  private cssNotSelectedClass:any;//buda aynısı durmadan classes() içinde değişiklik olduğu için

  public get uuid():string{
    return this._uuid;
  }
  public get classes():any{
    if(this.isSelected)
      return this.cssSelectedClass;
    return this.cssNotSelectedClass;
  }
  
  public get name(): string {
    return this._name;
  }
  public set name(val:string) {
    this._name=val;
  }
 
  public get blendMode():string{
    return this._blendMode;
  }
  public set blendMode(val:string){
    this._blendMode=val;
  }

  

 

  public mouseDown(event: MouseEvent,scroll:Point) {
    
    //this.isSelected = true;
    this.isMouseDown = true;
    
  }

  
  public mouseDownSelectedPoint(event: MouseEvent, corner: number) {
    

    this._mouseDownPoint.allFalse();
    this.isMouseDown = true;
  
    switch (corner) {
      //starts from left and rotates clock wise
      case 1: this._mouseDownPoint.isLeft = true; break;
      case 2: this._mouseDownPoint.isTopLeft = true; break;
      case 3: this._mouseDownPoint.isTop = true; break;
      case 4: this._mouseDownPoint.isTopRight = true; break;
      case 5: this._mouseDownPoint.isRight = true; break;
      case 6: this._mouseDownPoint.isBottomRight = true; break;
      case 7: this._mouseDownPoint.isBottom = true; break;
      case 8: this._mouseDownPoint.isBottomLeft = true; break;
      case 9: this._mouseDownPoint.isRotate = true; break;
      default:break;

    }
    event.preventDefault();
  }
  public mouseMove(event: MouseEvent,scroll:Point) {
    
    if(!this.isSelected)
        return;
    
    if (this._mouseDownPoint.isLeft && this.isMouseDown) {
      let move = RotationHelper.calculateRotationMoveLeft(event,this);
      this.calculateBy(move.width ,move.height,move.left,move.top,move.maskLeft,move.maskTop, new Callback(() => this.render()));
    } else   
    if (this._mouseDownPoint.isTop && this.isMouseDown) {
      let move = RotationHelper.calculateRotationMoveTop(event,this);
      this.calculateBy(move.width ,move.height,move.left,move.top,move.maskLeft,move.maskTop, new Callback(() => this.render()));
    } else
    
    if (this._mouseDownPoint.isRight && this.isMouseDown) {
      let move = RotationHelper.calculateRotationMoveRight(event,this);
      this.calculateBy(move.width ,move.height,move.left,move.top,move.maskLeft,move.maskTop, new Callback(() => this.render()));
    } else
    if (this._mouseDownPoint.isBottom && this.isMouseDown) {
     let move = RotationHelper.calculateRotationMoveBottom(event,this);
      this.calculateBy(move.width ,move.height,move.left,move.top,move.maskLeft,move.maskTop, new Callback(() => this.render()));
    } else
    if (this._mouseDownPoint.isRotate && this.isMouseDown) {
      let currentangle=this.rotateAngleDeg;       
      let move=event.movementX;
      
       currentangle+=move/2;
       if(currentangle>180)
           currentangle=180;
       if(currentangle<-180)
           currentangle=-180;
           this.rotateAngleDeg=currentangle;
     } else
    if (this.isSelected && this.isMouseDown) {
          
        
        this.marginLeft += event.movementX/this.scale;
        this.marginTop += event.movementY/this.scale;
       // console.log(this.marginLeft,this.marginTop,this.width,this.height);
        

      }
      event.preventDefault();

  }

  

  public mouseUp(event: any,scroll:Point) {

    //console.log(this.name + " mouseup");
    this._mouseDownPoint.allFalse();
    this.isMouseDown = false;

    event.preventDefault();
  }

  public doubleClick(event:any,scroll:Point){
    
  }

  public abstract render(): void;

  public abstract dispose();


    
  

  
  public hitMouseEvent(event:MouseEvent,scroll:Point):Point{
    if (this.htmlElement) {
      let rc = (<HTMLCanvasElement>this.htmlElement.nativeElement).getBoundingClientRect();
      
      let point =new Point(((event.clientX+scroll.x - (rc.left+scroll.x))/this.scale).extFloor(), ((event.clientY+scroll.y - (rc.top+scroll.y))/this.scale).extFloor());
         //console.log("layer hitmouseevent:",event.clientX,event.clientY,scroll.X,scroll.Y,rc.left,rc.top);
        if (point.x >= 0 && point.y >= 0 && point.x <= this.width && point.y <= this.height) {
          return point;
        }
      
    }
    return undefined;
  }
  public normalizeMouseEvent(event:MouseEvent,scroll:Point, makeNormalize:boolean=true):Point{
   
    if (this.htmlElement) {
      let rc = (<HTMLCanvasElement>this.htmlElement.nativeElement).getBoundingClientRect();
   
      let point =new Point(((event.clientX+scroll.x - (rc.left+scroll.x))/this.scale).extFloor(), ((event.clientY+scroll.y - (rc.top+scroll.y))/this.scale).extFloor());      
     // console.log("layer normalizeMouseEvent:",this.scale, event.clientX,event.clientY,point.X,point.Y, scroll.X,scroll.Y,rc.left,rc.top);
      if(makeNormalize){
        if(point.x<0)
        point.x=0;
        if(point.y<0)
        point.y=0;
        if(point.x>this.width)
        point.x=this.width;
        if(point.y>this.height)
        point.y=this.height;
      }
      return point;
        
      
    }
    return undefined;
  }

 

  


   

}

/**mouse down point holder for resizing, rotating */
class MouseDownPoint {
  public isLeft: boolean;
  public isTopLeft: boolean;
  public isTop: boolean;
  public isTopRight: boolean;
  public isRight: boolean;
  public isBottomRight: boolean;
  public isBottom: boolean;
  public isBottomLeft: boolean;
  public isRotate: boolean;
  constructor() {
    this.allFalse();
  }

  public allFalse(): void {

    this.isLeft = false;
    this.isTopLeft = false;
    this.isBottom = false;
    this.isBottomLeft = false;
    this.isBottomRight = false;
    this.isRight = false;
    this.isTop = false;
    this.isTopRight = false;
    this.isRotate = false;
  }
}
