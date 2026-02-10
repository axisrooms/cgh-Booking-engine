import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private lastKey: string = '';
  private lastValue: string = '';
  private subscription: Subscription;

  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.languageService.currentLanguage$.subscribe(() => {
      if (this.lastKey) {
        this.lastValue = this.languageService.translate(this.lastKey);
        this.cdr.markForCheck();
      }
    });
  }

  transform(key: string): string {
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.lastValue = this.languageService.translate(key);
    }
    return this.lastValue;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
