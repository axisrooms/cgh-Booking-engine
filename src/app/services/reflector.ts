import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Reflector<T>{

    private reactions: any = {}
    private model: any = {}

    public HOOKS = {
        BOOKING_CART: 'BOOKING_CART',
    }

    constructor() {
        this.reload()
    }

    reload(){
        try {
            this.model = JSON.parse(localStorage.getItem('reflectStore') + '')
            Object.keys(this.model).forEach(key => {
                this.reactions[key] = new BehaviorSubject<T>(this.model[key])
            })
            if (this.model == undefined || this.model == 'undefined') {
                this.model = {}
            }

        } catch (e) { }
    }

    public set(key: string, value: T) {
        if(this.model==null){
            this.model = {}
            this.reactions = {}
        }
        this.model[key] = value
        if (this.reactions[key] == undefined) {
            this.reactions[key] = new BehaviorSubject(value)
        }
        localStorage.removeItem('reflectStore');

        localStorage.setItem('reflectStore', JSON.stringify(this.model))
        this.reactions[key].next(value)
    }
    public get(key: string): T {
        return this.model[key]
    }
    public observe(key: string): Observable<T> {
        if (this.reactions[key] == undefined) {
            if(this.model==null){
                this.model = {}
                this.reactions = {}
            }
            if(this.model[key] === null || this.model[key] === undefined) {
                this.model[key] = {}
            }
            this.reactions[key] = new BehaviorSubject<T>(this.model[key])
        }
        return this.reactions[key];
    }
    public clear(key: string) {
        this.model[key] = {}
        if (this.reactions[key] == undefined) {
            this.reactions[key] = new BehaviorSubject<T>(this.model[key])
        }
        localStorage.removeItem('reflectStore');
        localStorage.setItem('reflectStore', JSON.stringify(this.model))
        this.reactions[key].next({})
    }
}