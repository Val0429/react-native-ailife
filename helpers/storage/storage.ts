import { AsyncStorage as StoragePool } from 'react-native';
import { Component } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

export class Storage<T extends Object> {
    private maps: { [K in keyof T]?: BehaviorSubject<T[K]> } = {};
    public ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor(data: T) {
        (async () => {
            let tmp: T = { ...(data as any) };
            let keys = await StoragePool.getAllKeys();
            for (let key of keys) {
                let val = JSON.parse(await StoragePool.getItem(key) || '{}');
                tmp[key] = { ...(tmp[key] || {}), ...val };
            }
            for (let key in tmp) {
                let output: any = tmp[key] || {};
                if (this.maps[key])
                    this.maps[key].next(output);
                else
                    this.maps[key] = new BehaviorSubject(output);
            }
            this.ready.next(true);
        })();
    }

    getSubject<K extends keyof T>(key: K): BehaviorSubject<T[K]> {
        let sj = this.maps[key];
        if (!sj) sj = this.maps[key] = new BehaviorSubject({} as any);
        return sj;
    }

    getObservable<K extends keyof T>(...keys: K[]): Observable<T[K]> {
        /// make sure Subjects are ready
        for (let key of keys) {
            let sj = this.maps[key];
            if (!sj) this.maps[key] = new BehaviorSubject({} as any);
        }

        return Observable.from( keys )
            .mergeMap( v => this.maps[v] )
            .scan( (final, value) => {
                return { ...final as any, ...value as any }
            })
            .switchMap( o => Observable.of(o) /* .delay(10) */ )
    }

    get<K extends keyof T>(key: K): T[K] {
        let sj = this.getSubject(key);
        return sj.getValue();
    }
    set<K extends keyof T>(key: K, value: T[K]): void {
        let sj = this.getSubject(key);
        StoragePool.setItem(key as string, JSON.stringify(value));
        sj.next(value);
    }
    update<K extends keyof T, U extends keyof T[K]>(key: K, subkey: U, value: T[K][U]) {
        this.set(key, {...(this.get(key) as any), [subkey]: value});
    }

    connect<K extends keyof T, U extends keyof T[K]>(source: Component, key: K, data: U, validator?: Validator) {
        return {
            value: (source.props as any)[data],
            onValueChange: (value) => {
                if (validator &&
                    ((validator instanceof RegExp) && !validator.test(value)) ||
                    (validator && typeof validator === 'function' && !validator(value))
                ) {
                    /// test failed
                    return;
                } else
                    this.update(key, data, value);
            }
        }
    }

    vbind<K extends keyof T, U extends keyof T[K]>(source: Component, key: K, data: U, validator?: Validator) {
        return {
            value: (source.props as any)[key][data],
            onValueChange: (value) => {
                if (validator &&
                    ((validator instanceof RegExp) && !validator.test(value)) ||
                    (validator && typeof validator === 'function' && !validator(value))
                ) {
                    // source.setState({ [data]: value });
                } else
                    this.update(key, data, value);
            }
        }
    }

    /// deprecated
    bind<K extends keyof T, U extends keyof T[K]>(source: Component, key: K, data: U, validator?: Validator) {
        return {
            value: (source.state as any)[data],
            onValueChange: (value) => {
                if (validator &&
                    ((validator instanceof RegExp) && !validator.test(value)) ||
                    (validator && typeof validator === 'function' && !validator(value))
                ) {
                    source.setState({ [data]: value });
                } else
                    this.update(key, data, value);
            }
        }
    }
}

export type Validator = RegExp | { (value: any): boolean };
