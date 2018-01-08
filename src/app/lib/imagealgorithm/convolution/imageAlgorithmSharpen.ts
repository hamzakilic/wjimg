import { ImageAlgorithmConvolution, ConvolutionMatrix } from './imageAlgorithmConvolution';

export class ImageAlgorithmSharpen extends ImageAlgorithmConvolution {
    /**
     *
     */
    constructor() {
        super("Sharpen", new ConvolutionMatrix(1, 0, [
            [-1, -1, -1],
            [-1, 9, -1],
            [-1, -1, -1],
        ]));

    }

}