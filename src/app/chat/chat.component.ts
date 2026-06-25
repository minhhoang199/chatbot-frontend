import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { NotificationService } from '../service/notification.service';
import { forkJoin, Subject, interval } from 'rxjs';
import { startWith, takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  username: string = '';
  avatarURL: string = 'assets/avatar.png';
  unreadMessagesByRoom: Record<number, number> = {};
  unreadMessagesCount = 0;
  unreadNotificationsCount = 0;
  showNotificationsPopup = false;
  showTranslateSettings = false;
  sourceLanguage: string = 'en';
  targetLanguage: string = 'vi';
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];
  private readonly TRANSLATE_SOURCE_LANG_KEY = 'translateSourceLanguage';
  private readonly TRANSLATE_TARGET_LANG_KEY = 'translateTargetLanguage';

  @ViewChild('notificationsTrigger', { read: ElementRef }) notificationsTrigger?: ElementRef<HTMLElement>;
  private destroy$ = new Subject<void>();

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private notificationService: NotificationService,
  ){}

  ngOnInit(): void {
    this.username = this.localStorageService.getString('username') || '';
    this.avatarURL = this.localStorageService.getString('linkAvatar') || 'assets/avatar.png';
    this.loadTranslateSettings();
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() =>
          forkJoin({
            unreadMessages: this.notificationService.unreadMessagesCount(),
            unreadNotifications: this.notificationService.unreadCount(),
          }),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: ({ unreadMessages, unreadNotifications }) => {
          this.unreadNotificationsCount = unreadNotifications ?? 0;
          this.unreadMessagesCount = Object.keys(unreadMessages || {}).length ?? 0;
          this.unreadMessagesByRoom = Object.entries(unreadMessages || {}).reduce(
            (acc, [roomId, count]) => {
              acc[Number(roomId)] = count;
              return acc;
            },
            {} as Record<number, number>,
          );
        },
        error: () => {
          this.unreadNotificationsCount = 0;
          this.unreadMessagesCount = 0;
          this.unreadMessagesByRoom = {};
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTranslateSettings(): void {
    this.sourceLanguage = this.localStorageService.getString(this.TRANSLATE_SOURCE_LANG_KEY) || 'en';
    this.targetLanguage = this.localStorageService.getString(this.TRANSLATE_TARGET_LANG_KEY) || 'vi';
  }

  openTranslateSettings(): void {
    this.loadTranslateSettings();
    this.showTranslateSettings = true;
    this.profileMenuOpen = false;
  }

  closeTranslateSettings(): void {
    this.showTranslateSettings = false;
  }

  saveTranslateSettings(): void {
    this.localStorageService.set(this.TRANSLATE_SOURCE_LANG_KEY, this.sourceLanguage);
    this.localStorageService.set(this.TRANSLATE_TARGET_LANG_KEY, this.targetLanguage);
    this.showTranslateSettings = false;
  }

  logout(): void {
    this.localStorageService.clear(); // Clear all data
    this.router.navigate(['/sign-in']); // Navigate to sign-in page
  }

  // Profile menu state and handlers
  profileMenuOpen: boolean = false;

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.profileMenuOpen = false;
    }

    if (!this.showNotificationsPopup) {
        return;
      }
  
      if (this.notificationsTrigger?.nativeElement.contains(target)) {
        return;
      }
  
      this.showNotificationsPopup = false;
  }

  toggleNotificationsPopup(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.showNotificationsPopup = !this.showNotificationsPopup;
  }

  closeNotificationsPopup(): void {
    this.showNotificationsPopup = false;
  }

  isCreatingGroupRoom: boolean = false;

  openCreateGroupRoom(): void {
    this.isCreatingGroupRoom = true;
  }

  closeCreateGroupRoom(): void {
    this.isCreatingGroupRoom = false;
  }

  isSearchingEmail: boolean = false;

  openSearchingEmail(): void {
    this.isSearchingEmail = true;
  }

  closeSearchingEmail(): void {
    this.isSearchingEmail = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
