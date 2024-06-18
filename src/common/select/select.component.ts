import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  Signal,
  ViewChild,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { Subject, debounceTime, fromEvent, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'input-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent<T = any> implements ControlValueAccessor {
  // @ViewChild('selectInput') selectInputRef?: ElementRef<HTMLInputElement>;
  // @ViewChild('iconWrapper')
  iconWrapperRef = viewChild<ElementRef<HTMLDivElement>>('iconWrapper');
  selectInputRef = viewChild<ElementRef<HTMLDivElement>>('selectInput');

  // @Input() options: selectArgs<T>[] = [];
  // @Input() debounce: number = 500;
  // @Input() disabled: boolean = false;
  // @Input() menuIconClick?: (event: MouseEvent) => void;
  options = input<selectArgs<T>[]>([]);
  debounce = input<number>(100);
  disabled = model<boolean>(false);
  menuIconClick = input<((event: MouseEvent) => void) | undefined>(undefined);

  change = output<T | null>();
  // @Output() change = new EventEmitter<T | null>();
  // @Output() input = new EventEmitter<string>();
  destroy$ = new Subject<void>();

  selectedItem = signal<selectArgs<T> | undefined | null>(undefined);
  filteredOptions = signal<selectArgs<T>[]>([]);
  inputValue = signal('');
  showList = signal(false);
  prevValue?: T | null;
  selectedIndex: number = 0;

  iconWrapperWidth = signal<number | undefined>(undefined);
  name = signal<string | number | null>('');

  constructor(@Optional() @Host() private controlRef: NgControl) {
    if (controlRef) {
      controlRef.valueAccessor = this;
      setTimeout(() => {
        this.name.set(controlRef.name);
      }, 0);
    }

    effect(
      () => {
        this.filteredOptions.set(this.options());
      },
      { allowSignalWrites: true }
    );

    effect(
      () => {
        this.iconWrapperWidth.set(
          this.iconWrapperRef()?.nativeElement.clientWidth! + 1
        );
      },
      { allowSignalWrites: true }
    );

    // close list when click outside
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        // console.log(target.getAttribute(`in-select`), this.name());
        if (target.getAttribute(`in-select`) != this.name()) {
          this.showList.set(false);
        }
      });

    effect(() => {
      fromEvent<InputEvent>(this.selectInputRef()?.nativeElement!, 'input')
        .pipe(
          tap((event) => {
            this.showList.set(true);
          }),
          debounceTime(this.debounce()),
          takeUntil(this.destroy$)
        )
        .subscribe((event) => this.onInputTyped(event));
    });
  }

  //#region  ControlValueAccessor
  private _onChange?: (val?: T | null) => void;
  private _onTouched?: () => void;

  writeValue(obj: T | null): void {
    this.selectedItem.set(this.options().find((item) => item.value == obj));
    this.prevValue = this.selectedItem()?.value;
    this.selectedIndex = Math.max(
      0,
      this.filteredOptions().findIndex((x) => x.value == obj)
    );
    this.inputValue.set(this.selectedItem()?.label ?? '');
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
  //#endregion

  // ngOnInit(): void {
  // this.filteredOptions.set(this.options());
  // const value = signal('');
  // }
  // ngAfterViewInit(): void {

  // }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onInputTyped(event: InputEvent) {
    // this._onTouched && this._onTouched();
    const target = event.target as HTMLInputElement;
    this.inputValue.set(target.value);
    const value = this.inputValue().trim().toLowerCase();
    this.filteredOptions.set(
      this.options()?.filter((item) => item.label.toLowerCase().includes(value))
    );
  }

  onInputKeydown(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowDown':
        event.preventDefault();
        this.showList.set(true);
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredOptions().length - 1
        );
        this.selectedItem.set(this.filteredOptions()[this.selectedIndex]);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.showList.set(true);
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.selectedItem.set(this.filteredOptions()[this.selectedIndex]);
        break;

      case 'Enter':
        event.preventDefault();
        this.toggleList();
        if (this.selectedItem()?.value != this.prevValue) {
          this.onSelectItemClick(this.selectedItem());
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.showList.set(false);
        break;

      default:
        break;
    }
  }

  onSelectItemClick(item?: selectArgs<T> | null) {
    this._onTouched && this._onTouched();
    this._onChange && this._onChange(item?.value);
    this.selectedItem.set(item!);
    this.inputValue.set(item?.label ?? '');
    this.prevValue = item?.value;
    this.selectedIndex = this.filteredOptions().findIndex((x) => x == item);
    this.change.emit(item?.value!);
    // console.log('showList1', this.showList());
    // this.showList.update((x) => false);
    // debugger;
    // console.log('showList2', this.showList());
  }

  onDeleteIconClick(event: MouseEvent) {
    event.stopPropagation();
    this._onTouched && this._onTouched();
    this._onChange && this._onChange(null);
    this.inputValue.set('');
    this.filteredOptions.set(this.options());
    this.selectedIndex = 0;
    this.selectedItem.set(null);
    this.prevValue = null;
    this.change.emit(null);
  }

  onInputClick(event: MouseEvent) {
    this.toggleList();
  }

  // onArrowIconClick(event: MouseEvent) {
  //   event.stopPropagation();
  //   this.toggleList();
  // }

  // onMenuIconClick(event: MouseEvent) {
  //   event.stopPropagation();
  //   console.log(event.target);
  //   console.log('menu click');
  // }

  toggleList() {
    this.showList.update((x) => !x);
  }
}

export type selectArgs<T = any> = {
  label: string;
  value: T | null;
};
