import React, { Component } from 'react';
import { Storage } from './storage';
import { Subscription, Observable } from 'rxjs';


type ExtractS<T> = T extends Storage<infer U> ? U : never;
type ExtractC<T> = T extends Component<infer K, infer U> ? K : T;


export function Connect<T extends Storage<any>, K extends keyof ExtractS<T>>(storage: T, ...keys: K[]) {
    return function<U extends Component>(Class: { new (...args): U } ): { new (...args): U } {
        let o = class extends Component< ExtractC<U> > {
            private subscription: Subscription;
            constructor(props) {
                super(props);
                this.state = {};
            }
            componentDidMount() {
                this.subscription = storage.getObservable(...(keys as any))
                    .subscribe( (data) => this.setState(data));
            }
            componentWillUnmount() {
                this.subscription && this.subscription.unsubscribe();
            }
            render() {
                return (
                    <Class {...this.props} {...this.state} />
                );
            }
        }
        return o as any;
    }
}


export interface IConnectObservables {
    [index: string]: Observable<any>;
}
export function ConnectObservables(obs: IConnectObservables, delay: number = undefined) {
    let keys = Object.keys(obs);
    return function<U extends Component>(Class: { new (...args): U }): { new (...args): U } {
        let o = class extends Component< ExtractC<U> > {
            private subscription;
            constructor(props) {
                super(props);
                this.state = {};
                for (let key of keys) this.state[key] = {};
            }
            componentDidMount() {
                let observables = keys.map( key => obs[key] );

                this.subscription = Observable.from(observables)
                    .mergeMap( v => v, (e, res, idx) => {
                        return {
                            [keys[idx]]: res
                        }
                    })
                    .scan( (final, value) => {
                        return { ...final as any, ...value as any }
                    } )
                    .switchMap( o => delay ? Observable.of(o).delay(delay) : Observable.of(o) )
                    .subscribe( (data) => this.setState(data) );
            }
            componentWillUnmount() {
                this.subscription && this.subscription.unsubscribe();
            }
            render() {
                return (
                    <Class {...this.props} {...this.state} />
                )
            }
        }
        return o as any;
    }
}

export function ConnectIsEmpty(data: any) {
    if (data === undefined || data === null) return true;
    if (typeof data === 'object' && Object.keys(data).length === 0) return true;
    return false;
}