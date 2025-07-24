import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  set(key: string, value: string|number): void {
    console.log(this.storage);
    console.log(key);
    this.storage[key] = value;
  }

  getString(key: string): string {
    return this.storage[key] || false;
  }

  getNumber(key: string): number {
    return this.storage[key] || false;
  }

  setObject(key: string, value: any): void {
    if (!value) {
      return;
    }

    this.storage[key] = JSON.stringify(value);
  }

  getObject(key: string): any {
    return JSON.parse(this.storage[key] || '{}');
  }

  getValue<T>(key: string): T|null {
    const obj = JSON.parse(this.storage[key] || null);
    return <T>obj || null;
  }

  remove(key: string): any {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  get length(): number {
    return this.storage.length;
  }

  get isStorageEmpty(): boolean {
    return this.length === 0;
  }
}
