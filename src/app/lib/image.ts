
import { Callback } from './callback';
import { HEventEmitter } from './eventEmitter';


/**
 * an image with a RGBA  pixel layout,
 * top to bottom, left to right
 */
export class HImage extends HEventEmitter {

    private _width: number;
    private _height: number;
    private _pixels: Uint8ClampedArray;
    public Pixels: Uint8ClampedArray;
    public PixelsView: DataView;

    /**
     *
     * @param width width of image in pixels
     * @param height height of image in pixels
     * @param pixels data of pixels as RGBA
     *
     * remarks pixel array does not copy buffer, only copies reference
     * you must check error with   lastError() function, if it is not undefined then
     * an error occured means
     */
    public constructor(width: number, height: number, pixels?: Uint8ClampedArray) {
        super();


        //check width or height
        this._height = height;
        this._width = width;
        if (pixels){
            //check if pixels count is equal to buffer count

              this._pixels = pixels;

        }
        else{
            this._pixels =new Uint8ClampedArray(width * height * 4);
            this._pixels.fill(255);

        }
        this.Pixels = this._pixels;
        this.PixelsView= new DataView(this._pixels.buffer,0);
    }


    /**
     * @returns width of image in pixels
     */
    public width(): number {
        return this._width;
    }
    /**
     * @returns height of image in pixels
     */
    public height(): number {
        return this._height;
    }

    public fill(val: number,start?: number, end?: number){
        this._pixels.fill(val,start,end);
    }
    public clone(): HImage {
        let arr = new Uint8ClampedArray(this._width*this._height*4);
        arr.set(this._pixels);
        return new HImage(this._width,this._height,arr);
    }






}






