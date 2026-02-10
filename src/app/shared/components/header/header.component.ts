import { Component, OnInit } from '@angular/core';
import { HotelBgService } from '../../services/hotel-bg.service';
import { BookingConfigService } from 'src/app/services/bookingid.service';
import { LanguageService, Language } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  bgUrl: string = '';
  languages: Language[] = [];
  currentLang: string = 'en';
  isLangDropdownOpen: boolean = false;

  constructor(
    private hotelBgService: HotelBgService, 
    private bookingConfig: BookingConfigService,
    public languageService: LanguageService
  ) { }

  ngOnInit(): void {
    // choose a background image based on bookingEngineId (falls back to default)
    const id = this.bookingConfig.getBookingEngineId();
    const img = this.hotelBgService.getImageForId(id);
    // store relative path; template will set CSS variable using this value
    this.bgUrl = img;

    // Initialize language
    this.languages = this.languageService.getLanguages();
    this.currentLang = this.languageService.getCurrentLanguage();
    
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleLangDropdown(): void {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  selectLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
    this.isLangDropdownOpen = false;
  }

  getCurrentLanguageDisplay(): Language | undefined {
    return this.languages.find(l => l.code === this.currentLang);
  }

  closeLangDropdown(): void {
    this.isLangDropdownOpen = false;
  }
}
