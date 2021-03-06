import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ColorPickerService} from './color-picker.service';
import { ColorPickerComponent, SliderDirective,TextDirective } from './color-picker.directive';


@NgModule({
    imports: [CommonModule],
    providers: [ColorPickerService],
    declarations: [ColorPickerComponent,TextDirective,SliderDirective],
    exports: [ColorPickerComponent]
})
export class ColorPickerModule {}
