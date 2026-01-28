import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ImagePopupData {
  images: string[];
  currentIndex: number;
}

@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.css']
})
export class ImagePopupComponent implements OnInit {
  images: string[] = [];
  currentIndex: number = 0;
  currentImage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImagePopupData | string,
  ) { }

  ngOnInit(): void {
    // Support both old format (single image string) and new format (images array)
    if (typeof this.data === 'string') {
      this.images = [this.data];
      this.currentIndex = 0;
    } else {
      this.images = this.data.images.filter(img => img && img.trim() !== '');
      this.currentIndex = this.data.currentIndex || 0;
    }
    this.updateCurrentImage();
  }

  updateCurrentImage(): void {
    if (this.images.length > 0) {
      this.currentImage = this.images[this.currentIndex];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Loop to last
    }
    this.updateCurrentImage();
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop to first
    }
    this.updateCurrentImage();
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'Escape') {
      this.onNoClick();
    }
  }
}
