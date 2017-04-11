import { Component,OnChanges,DoCheck, OnInit,ViewChild,ElementRef, Input } from '@angular/core';
import {messageBus} from '../../lib/messageBus';
import {utility} from '../../lib/utility';
import {graphics} from '../../lib/graphics';
import {callback as iskilip_callback } from 'iskilip/core/callback.d';

@Component({
  selector: 'componentCanvasTarget',
  templateUrl: './canvas-target.component.html',
  styleUrls: ['./canvas-target.component.scss']
})
export class CanvasTargetComponent implements OnInit,OnChanges,DoCheck {
   width: number;
   height: number;
   stwidth:number;
   stheight:number;
   uuid: string;
   scale: number;
   private initFunc: iskilip_callback;
   private initialized:boolean;

  //we will use this for reaching to a component with name
  @Input() name: string;


  @ViewChild("renderCanvas") canvas: ElementRef;
  grphics: graphics;
  constructor() {
    this.width = 0;
    this.height = 0;
    this.stwidth=this.width;
    this.stheight=this.height;

    //create a uuid for component
    this.uuid = utility.uuid();
    this.scale = 1;
    this.initialized = false;
   }

  ngOnInit() {

  }
  ngAfterViewInit(){
   if(this.name)
        //if this canvas has a name add to singleton dictionary for later reaching
    canvasTargetComponentsDictionary.add(this.name,this);



  }

  ngOnDestroy(){

  }
  ngOnChanges(changes){



  }
  ngDoCheck(){


  }
  ngAfterContentChecked(){



  }

  ngAfterViewChecked(){

    if(!this.initialized && this.width>0)
      if(this.width == this.canvas.nativeElement.width && this.height == this.canvas.nativeElement.height){
        this.initialized = true;
        this.grphics = new graphics(this.canvas,this.width,this.height);
        console.log('testte clkajsfs');
        if(this.initFunc)
          this.initFunc.call(undefined);
      }


  }
  public scalePlus():void{
      this.scale *= 1.1;
      if(this.scale>5)
        this.scale = 5;
      this.stwidth = this.scale* this.width;
      this.stheight = this.scale * this.height;
  }
  public scaleMinus():void{
      this.scale *= 0.9;
      if(this.scale<0.1)
        this.scale = 0.1;
      this.stwidth = this.scale* this.width;
      this.stheight = this.scale * this.height;
  }

  public setWidthHeight(width:number,height:number,func?: iskilip_callback): void {

      this.width = width;
      this.height = height;
      this.scale = 1;
      this.stwidth = this.width;
      this.stheight = this.height;
      this.initFunc =func;
      this.initialized =false;



  }



}


/**
 * a static class for following every @see CanvasTargetComponent
 *
 */
export class canvasTargetComponentsDictionary{
    private static dic: Map<string,CanvasTargetComponent> = new Map<string,CanvasTargetComponent>();

    /**
     *
     * @param name name of component
     * @param component
     */
    public static add(name: string,component: CanvasTargetComponent){
      if(name && component)
      if(!canvasTargetComponentsDictionary.dic.has(name)){
        canvasTargetComponentsDictionary.dic.set(name,component);

      }
    }

    /**
     *
     * @param name name of canvas target component
     */
    public static remove(name: string){
      if(name){
         if(canvasTargetComponentsDictionary.dic.has(name))
        canvasTargetComponentsDictionary.dic.delete(name);

      }

    }

    public static contains(name: string):boolean{
        return canvasTargetComponentsDictionary.dic.has(name)
      }


/**
 *
 * @param name name of canvas component
 * @returns if has a canvas with parameter name returns canvas else returns undefined
 */
    public static get(name:string): CanvasTargetComponent{
      if(name){
        if(canvasTargetComponentsDictionary.dic.has(name)){
          return canvasTargetComponentsDictionary.dic.get(name);
        }
      }
      return undefined;
    }
}
