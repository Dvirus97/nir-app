import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonComponent } from './person/person.component';
import { PersonService } from './person.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CopyTooltipComponent } from './copy-tooltip/copy-tooltip.component';
import { TooltipDirective } from '../common/tooltip.directive';

const component = [PersonComponent, CopyTooltipComponent];

@NgModule({
  declarations: [component],
  imports: [CommonModule, ReactiveFormsModule, TooltipDirective],
  exports: [component],
  providers: [PersonService],
})
export class PersonModule {}
