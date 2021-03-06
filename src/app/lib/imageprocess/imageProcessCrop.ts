import { ImageAlgorithmRotate } from './../imagealgorithm/imageAlgorithmRotate';
import { ImageAlgorithmCrop } from './../imagealgorithm/imageAlgorithmCrop';
import { Color } from './../draw/color';

import { HMath } from './../hMath';
import { Rect } from './../draw/rect';
import { HImage } from './../image';
export class ImageProcessCrop{

    public static process(img: HImage, rectSource: Rect, rectDestination: Rect, angleDegrees: number): HImage {
        if (angleDegrees == 0) {
            
            let rectIntersect = HMath.intersectRect(rectSource, rectDestination);
            if (!rectIntersect)
                return undefined;
            rectIntersect.x -= rectSource.x;
            rectIntersect.y -= rectSource.y;
            rectIntersect.x = rectIntersect.x.extRound();
            rectIntersect.y = rectIntersect.y.extRound();
            rectIntersect.width = rectIntersect.width.extRound();
            rectIntersect.height = rectIntersect.height.extRound();
            return  img.processImmutable(new ImageAlgorithmCrop(rectIntersect));
        } else {
            let rotatedSourceRect = HMath.rotateRect(rectSource, angleDegrees);
            let rectIntersect = HMath.intersectRect(rotatedSourceRect, rectDestination);
            if (!rectIntersect)
                return undefined;
            rectIntersect.x -= rotatedSourceRect.x;
            rectIntersect.y -= rotatedSourceRect.y;
            rectIntersect.x = rectIntersect.x.extRound();
            rectIntersect.y = rectIntersect.y.extRound();
            rectIntersect.width = rectIntersect.width.extRound();
            rectIntersect.height = rectIntersect.height.extRound();

            let rotatedImage= img.processImmutable(new ImageAlgorithmRotate(angleDegrees,new Color(0,0,0,0)));
            //return rotatedImage;
           return rotatedImage.processImmutable(new ImageAlgorithmCrop(rectIntersect));

        }
       

    }

}