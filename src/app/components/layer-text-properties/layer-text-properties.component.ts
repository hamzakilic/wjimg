import { Component, OnInit, Input } from '@angular/core';

import { Layer } from "../../models/photoedit/layer";
import { LayerText } from "../../models/photoedit/layerText";

import { FontService } from "../../services/font.service";


@Component({
  selector: 'layer-text-properties',
  templateUrl: './layer-text-properties.component.html',
  styleUrls: ['./layer-text-properties.component.scss'],
  
})
export class LayerTextPropertiesComponent implements OnInit {

  @Input()
  layer: LayerText;
  
  private fontService:FontService;
  constructor(fontService:FontService) {
    this.fontService=fontService;
  
    
   }

  ngOnInit() {
    
  }

  changeText(value: any, layer: LayerText){
    if(!value){     
      value="";
    }
    layer.setText(value);
  }

   public get items():Array<string>{
     return this.fontService.fonts;
   }
 
  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
 
  private get disabledV():string {
    return this._disabledV;
  }
 
  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }


  public currentLayerFontFamily(){
    let fonts=[];
    fonts.push(this.layer.fontFamily);
    return fonts;
  }
  public currentLayerFontSize():number{
    return this.layer.fontSize;
  }
 public currentLayerIsBold():boolean{
    return this.layer.isBold;
  }

  public currentLayerIsItalic():boolean{
    return this.layer.isItalic;
  }

public changeIsItalic(value:any){
  this.layer.setIsItalic(value.target.checked);
}


public changeIsBold(value:any){
  this.layer.setIsBold(value.target.checked);
}

public changeFontSize(value:any){
  if(parseInt(value))
  this.layer.setFontSize(parseInt(value));
}


  public selected(value:any):void {
    
    this.layer.setFontFamily(value.text);
  }
 
  public removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  public typed(value:any):void {
    console.log('New search input: ', value);
  }
 
  public refreshValue(value:any):void {
    this.value = value;
  }

  public  get color():string{
    return this.layer.color;
  }

   public set color(value:string){

     this.layer.setColor(value);
  }

  public colorChanging(value:string){
  
   this.color=value;
   
  }
  calculateForeground():string{
    let color= "#FF"+ this.color.substring(3,5)+"0F";
   
    return color;
  }

}
