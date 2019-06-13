import * as request from 'request';
import { client } from 'websocket';
import { Observable, BehaviorSubject, Subject, Observer } from 'rxjs';
import { UserType, sjRecognizedUser, sjUnRecognizedUser, RecognizedUser, UnRecognizedUser, Gender, Demographic } from './frs-service/core';
export * from './frs-service/core';
import RNFetchBlob from "react-native-fetch-blob";
import { filterFace } from './frs-service/filter-face';
import { Config } from './frs-service/config';
import { StorageInstance as Storage } from './../config/storage';

export interface FetchOptions {
    excludeFaceFeature?: boolean;
    name?: string;
    groups?: string[];
    cameras?: string[];
}

export interface IFCSSettings {
    video_source_sourceid: string;
    video_source_location: string;
    video_source_type: 'rtsp' | 'cms';
    video_source_ip?: string;
    video_source_port?: number;
    video_source_username?: string;
    video_source_password?: string;
    video_source_rtsp_path?: string;
}

export class FRSService {
    private sessionId: string;
    public sjLogined: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private sjRecovered: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public livestream: Observable<RecognizedUser | UnRecognizedUser>;
    public sjLiveFace: Subject<RecognizedUser | UnRecognizedUser> = new Subject();
    public sjFRSLoginResult: Subject<boolean> = new Subject<boolean>();

    constructor() {
        this.login();

        (async () => {
            /// init main stream
            this.livestream = Observable.merge(sjRecognizedUser, sjUnRecognizedUser)
                .share()
                .pipe( filterFace( async (compared) => {
                    this.sjLiveFace.next(compared);
                }) )

        })();
    }

    /// public functions ////////////////////
    /// load faces from remote FRS
    // fetchAll(starttime: number, endtime: number, pageSize: number = 20): Subject<RecognizedUser | UnRecognizedUser> {
    //     var sj = new Subject<RecognizedUser | UnRecognizedUser>();

    //     const url: string = this.makeUrl('getverifyresultlist');
    //     const urlnon: string = this.makeUrl('getnonverifyresultlist');

    //     /// get raw data from FRS, merge all pages
    //     function poll(starttime: number, endtime: number, url: string, page: number = 0): Observable<RecognizedUser[] | UnRecognizedUser[]> {
    //         function doRequest(observer: Observer<any>, page: number = 0)  {
    //             let bodyparam = { session_id: this.sessionId, start_time: starttime, end_time: endtime, page_size : 20, skip_pages: page };
    //             request({
    //                 url,
    //                 method: 'POST',
    //                 json: true,
    //                 body: bodyparam
    //             }, (err, res, body) => {
    //                 // console.log('body', body);
    //                 var result = (body.result || body.group_list || {});
    //                 var results = result.verify_results;
    //                 //console.log(url, bodyparam, results.length);
    //                 if (!results || results.length === 0) {
    //                     observer.complete();
    //                     return;
    //                 }
    //                 observer.next(results);
    //                 doRequest.call(this, observer, result.page_index+1);
    //             });
    //         }

    //         return Observable.create( (observer) => {
    //             doRequest.call(this, observer);
    //         }).share();
    //     }

    //     /// indexes
    //     var recog = { timestamp: 0, finished: false, data: [] };
    //     var unrecog = { timestamp: 0, finished: false, data: [] };
    //     var queue = [];
       
    //     /// finalize search result
    //     async function queueHandler() {
    //         while (queue.length > 0) {
    //             sj.next(queue.shift());
    //         }

    //         if (recog.finished === true && unrecog.finished === true)
    //             sj.complete();
    //     }

    //     function prepareQueue(recognizeBase: boolean) {
    //         var base = recognizeBase ? recog : unrecog;
    //         var ref = recognizeBase ? unrecog : recog;
    //         //if (base.data.length === 0) return;
    //         while (base.data.length > 0) {
    //             /// 1) get time
    //             var basetime = base.data[0].timestamp;
    //             var reftime = ref.data.length > 0 ? ref.data[0].timestamp : Number.MAX_SAFE_INTEGER;
    //             /// 2) if >= ref timestamp, return
    //             if (!ref.finished && basetime > ref.timestamp) return;
    //             /// 3) pick one smaller
    //             if (basetime <= reftime) queue.push( base.data.shift() );
    //             else queue.push( ref.data.shift() );
    //         }
    //         queueHandler();
    //     }

    //     (async () => {
    //         await this.waitForLogin();

    //         /// handle response
    //         var obRecog = poll.call(this, starttime, endtime, url);
    //         obRecog.subscribe({
    //                 next: (data: RecognizedUser[]) => {
    //                     recog.timestamp = data[data.length-1].timestamp;
    //                     data.forEach( (value: RecognizedUser) => value.type = UserType.Recognized );
    //                     recog.data.push.apply(recog.data, data);
    //                     prepareQueue(true);
    //                 },
    //                 complete: () => {
    //                     recog.finished = true;
    //                     prepareQueue(true);
    //                 }
    //             });
    //         var obUnRecog = poll.call(this, starttime, endtime, urlnon);
    //         obUnRecog.subscribe({
    //                 next: (data: UnRecognizedUser[]) => {
    //                     unrecog.timestamp = data[data.length-1].timestamp;
    //                     data.forEach( (value: UnRecognizedUser) => value.type = UserType.UnRecognized );
    //                     unrecog.data.push.apply(unrecog.data, data);
    //                     prepareQueue(false);
    //                 },
    //                 complete: () => {
    //                     unrecog.finished = true;
    //                     prepareQueue(false);
    //                 }
    //             });

    //         Observable.forkJoin(obRecog, obUnRecog)
    //             .subscribe( () => {
    //                 /// combine last
    //                 var final = [ ...recog.data, ...unrecog.data ].sort( (a, b) => a.timestamp - b.timestamp );
    //                 queue.push.apply(queue, final);
    //                 queueHandler();
    //             });
    //     })();
       
    //     return sj;
    // }

    // search(face: RecognizedUser | UnRecognizedUser, starttime: number, endtime: number): Subject<RecognizedUser | UnRecognizedUser> {
    //     let sj = new Subject<RecognizedUser | UnRecognizedUser>();

    //     (async () => {
    //         /// 0) extract back timestamp from snapshot
    //         let snapshot = face.snapshot;
    //         let regex = /^[^0-9]*([0-9]+)/;
    //         let timestamp = +snapshot.match(regex)[1];

    //         /// 1) get back face_feature
    //         let faceFeature, faceBuffer;
    //         let backs: any[] = await this.fetchAll(timestamp, timestamp)
    //             .bufferCount(Number.MAX_SAFE_INTEGER)
    //             .toPromise();

    //         /// 1.1) FRS record being deleted. try again within local db.
    //         if (backs === undefined) {
    //             backs = await this.localFetchAll(face.timestamp, face.timestamp)
    //                 .bufferCount(Number.MAX_SAFE_INTEGER)
    //                 .toPromise();
    //         }
    //         if (backs === undefined) backs = [];

    //         for (var back of backs) {
    //             if (snapshot === back.snapshot) {
    //                 faceFeature = back.face_feature;
    //                 break;
    //             }
    //         }
    //         faceBuffer = new Buffer(faceFeature, 'binary');

    //         /// 2)
    //         /// 2.1) adjust starttime / endtime with possible companion duration
    //         let adjustStartTime = starttime - Config.fts.possibleCompanionDurationSeconds*1000;
    //         let adjustEndTime = endtime + Config.fts.possibleCompanionDurationSeconds*1000;
    //         this.localFetchAll(adjustStartTime, adjustEndTime, { excludeFaceFeature: face.type === UserType.Recognized ? true : false })
    //             .pipe( semaphore<RecognizedUser | UnRecognizedUser>(16, async (data) => {
    //                 if (face.type === UserType.UnRecognized && data.type === UserType.UnRecognized) {
    //                     // //var buffer = new Buffer(data.face_feature, 'binary');
    //                     let buffer = (data.face_feature as any).buffer;
    //                      var score = await FaceFeatureCompare.async(faceBuffer, buffer);
    //                     data.score = score;
    //                 }
    //                 return data;
    //             }) )
    //             .pipe( face.type === UserType.Recognized ? searchRecognizedFace(face) : searchUnRecognizedFace(face) )
    //             .subscribe( async (data) => {
    //                 sj.next(data);

    //             }, () => {}, async () => {
    //                 sj.complete();
    //             });

    //     })();
        
    //     return sj;
    // }
    /////////////////////////////////////////

    /// private functions ///////////////////
    private loggingIn: boolean = false;
    private maintainTimer: number = null;
    private login() {
        let tryLogin = async () => {
            if (this.loggingIn === true) return;
            const url = this.makeUrl("login");
            this.loggingIn = true;
            try {
                let buffer = await Promise.race([ fetch(url, {
                        method: 'POST',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": 'application/json',
                            Connection: "close",
                        },
                        body: JSON.stringify({ username: Config.frs.account, password: Config.frs.password })
                    }),
                    Observable.of(true).delay(3000).toPromise()
                ]);
                if (typeof buffer === "boolean") throw "Login failed";
                let body = await buffer.json();
                this.loggingIn = false;
                this.sjLogined.next(true);
                console.log(`Login into FRS Server@${Config.frs.ip}:${Config.frs.apiPort}.`);
                this.sjFRSLoginResult.next(true);

                this.sessionId = body.session_id;
                /// After login and got session_id, maintain session every 1 minute.
                if (this.maintainTimer !== null) clearInterval(this.maintainTimer);
                this.maintainTimer = setInterval( async () => {
                    var result = await this.maintainSession();
                    if (!result) clearInterval(this.maintainTimer);
                }, 60000);
                this.doWebsocketListen();
                
            } catch(e) {
                this.loggingIn = false;
                console.log(`Login FRS Server failed@${Config.frs.ip}:${Config.frs.apiPort}. Retry in 1 second.`);
                this.sjFRSLoginResult.next(false);
                setTimeout(() => { tryLogin(); }, 1000);
                return;
            }


            // request({
            //     url, method: 'POST', json: true,
            //     body: { username: Config.frs.account, password: Config.frs.password }
            // }, (err, res, body) => {
            //     this.loggingIn = false;
            //     if (err || !body) {
            //         console.log(`Login FRS Server failed@${Config.frs.ip}:${Config.frs.apiPort}. Retry in 1 second.`);
            //         setTimeout(() => { tryLogin() }, 1000);
            //         return;
            //     }

            //     this.sjLogined.next(true);
            //     console.log(`Login into FRS Server@${Config.frs.ip}:${Config.frs.apiPort}.`);

            //     this.sessionId = body.session_id;
            //     /// After login and got session_id, maintain session every 1 minute.
            //     if (this.maintainTimer !== null) clearInterval(this.maintainTimer);
            //     this.maintainTimer = setInterval( async () => {
            //         var result = await this.maintainSession();
            //         if (!result) clearInterval(this.maintainTimer);
            //     }, 60000);
            //     this.doWebsocketListen();
            // });
            
        }
        if (!Config.frs.ip || !Config.frs.apiPort || !Config.frs.socketPort) {
            console.log('!', Config, Storage.get("settingsFRS"));
            setTimeout(() => { this.login(); }, 1000);
            return;
        }
        tryLogin();
    }

    public pushFace(image: string): Promise<void> {
        const url: string = this.makeUrl('verifyface');
        var me = this;

        return new Promise( async (resolve, reject) => {
            let body = {
                session_id: this.sessionId,
                target_score: 0.8,
                request_client: "attendance_client",
                action_enable: 1,
                source_id: "attendance_client",
                location: "attendance_client",
                image
            };
            let result = (await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            })).text();
            resolve();
        });
    }

    public getFCSSettings(): Promise<IFCSSettings[]> {
        const url: string = this.makeUrl('getfcssettings');
        let me = this;

        return new Promise( async (resolve, reject) => {
            let body = {
                session_id: this.sessionId
            }
            let result = await (await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
            })).json();
            resolve((result as any).fcs_settings);
        });
    }

    private maintainSession(): Promise<boolean> {
        const url: string = this.makeUrl('maintainsession');
        var me = this;

        return new Promise( async (resolve, reject) => {
            try {
                let body = await (await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({ session_id: this.sessionId })
                })).json();
                console.log('maintain success', body);
                resolve(true);
                
            } catch(e) {
                this.sjLogined.next(false);
                console.log(`Maintain FRS session failed@${Config.frs.ip}:${Config.frs.apiPort}.`);
                resolve(false);
                me.login();
                return;
            }

            // request({
            //     url, method: 'POST', json: true,
            //     body: { session_id: this.sessionId }
            // }, (err, res, body) => {
            //     if (!body || body.message === 'Unauthorized.') {
            //         this.sjLogined.next(false);
            //         console.log(`Maintain FRS session failed@${Config.frs.ip}:${Config.frs.apiPort}.`);
            //         resolve(false);
            //         me.login();
            //         return;
            //     }
            //     console.log('maintain success', body);
            //     resolve(true);
            // });

        });
    }

    websocketInited: boolean = false;
    private doWebsocketListen() {
        if (this.websocketInited) return;
        this.websocketInited = true;
        function makeConnection(url: string, callback: (data: any) => void) {
            var cli = new WebSocket(url);
            var me = this;
            var timer;
            function reconnect() {
                timer && clearTimeout(timer);
                timer = setTimeout( () => makeConnection.call(me, url, callback), 1000 );
            }

            cli.onopen = () => {
                cli.send(JSON.stringify({
                    "session_id": this.sessionId
                }));
            }
            cli.onerror = (err) => {
                console.log("FRS Connection Error", err);
                reconnect();
            }
            cli.onclose = () => {
                console.log("FRS Connection Closed");
                reconnect();
            }
            cli.onmessage = (message) => {
                var data = eval(`(${message.data})`);
                let code = (<any>data).code;
                if (code) {
                    if (code === 200) return;
                    if (code === 401) {
                        console.log('FRS error, message', data);
                        me.login();
                        return;
                    }
                    console.log('FRS error, message', data);
                    return;
                }
                callback && callback(data);
            }


            // cli.on('connect', (connection) => {
            //     connection.on('error', (err) => {
            //         console.log("FRS Connection Error", err);
            //         reconnect();
            //     });
            //     connection.on('close', () => {
            //         console.log("FRS Connection Closed");
            //         reconnect();
            //     });
            //     connection.on('message', (message) => {
            //         var data = eval(`(${message.utf8Data})`);
            //         let code = (<any>data).code;
            //         if (code) {
            //             if (code === 200) return;
            //             if (code === 401) {
            //                 console.log('FRS error, message', data);
            //                 me.login();
            //                 return;
            //             }
            //             console.log('FRS error, message', data);
            //             return;
            //         }
            //         callback && callback(data);
            //     });
            //     connection.sendUTF(JSON.stringify({
            //         "session_id": this.sessionId
            //     }));
            // });
            // cli.on('connectFailed', (err) => {
            //     console.log("FRS Connect Error: ", err);
            //         setTimeout( () => reconnect() );
            // });
            // cli.connect(url, 'echo-protocol');


            // var cli = new client();
            // var me = this;
            // var timer;
            // function reconnect() {
            //     timer && clearTimeout(timer);
            //     timer = setTimeout( () => makeConnection.call(me, url, callback), 1000 );
            // }

            // cli.on('connect', (connection) => {
            //     connection.on('error', (err) => {
            //         console.log("FRS Connection Error", err);
            //         reconnect();
            //     });
            //     connection.on('close', () => {
            //         console.log("FRS Connection Closed");
            //         reconnect();
            //     });
            //     connection.on('message', (message) => {
            //         var data = eval(`(${message.utf8Data})`);
            //         let code = (<any>data).code;
            //         if (code) {
            //             if (code === 200) return;
            //             if (code === 401) {
            //                 console.log('FRS error, message', data);
            //                 me.login();
            //                 return;
            //             }
            //             console.log('FRS error, message', data);
            //             return;
            //         }
            //         callback && callback(data);
            //     });
            //     connection.sendUTF(JSON.stringify({
            //         "session_id": this.sessionId
            //     }));
            // });
            // cli.on('connectFailed', (err) => {
            //     console.log("FRS Connect Error: ", err);
            //         setTimeout( () => reconnect() );
            // });
            // cli.connect(url, 'echo-protocol');
        }

        const url: string = `ws://${Config.frs.ip}:${Config.frs.socketPort}/frs/ws/fcsreconizedresult`;
        const urlnon: string = `ws://${Config.frs.ip}:${Config.frs.socketPort}/frs/ws/fcsnonreconizedresult`;
        makeConnection.call(this, url, (data: RecognizedUser) => {
            // console.log('recognized result', data);
            sjRecognizedUser.next({type: UserType.Recognized, ...data});
        });
        makeConnection.call(this, urlnon, (data: UnRecognizedUser) => {
            // console.log('unrecognized result', data);
            sjUnRecognizedUser.next({type: UserType.UnRecognized, ...data});
        });
    }

    // private async writeDB() {
    //     /// read local db
    //     let col = this.db.collection(collection);

    //     let sjBatchSave: Subject<any> = new Subject();
    //     let bsSubscription = sjBatchSave.bufferTime(1000)
    //         .subscribe( (data: any[]) => {
    //             if (data.length === 0) return;
    //             col.insertMany(data);
    //         });
        
    //     this.livestream
    //         .pipe( saveSnapshot(12) )
    //         .subscribe((data) => {
    //             let picked = this.makeDBObject(data);
    //             sjBatchSave.next(picked);
    //         });
    // }
    /////////////////////////////////

    snapshotUrl(image: string): string {
        return this.makeUrl(`snapshot/session_id=${this.sessionId}&image=${image}`);
    }

    snapshot(image: string, resp: Response = null): Promise<string> {
        return new Promise<string>( async (resolve, reject) => {
            await this.waitForLogin();
            var url: string = this.makeUrl(`snapshot/session_id=${this.sessionId}&image=${image}`);

            try {
                let res = await RNFetchBlob.fetch('GET', url);
                let base64 = res.base64();
                resolve(base64);
                
            } catch(e) {
                console.log('error', e)
                reject(e);
            }
        });
    }

    demographic(image: string): Promise<Demographic> {
        return new Promise<Demographic>( async (resolve, reject) => {
            const url = `http://${Config.dgs.ip}:${Config.dgs.apiPort}/demographic/ageGender`;
            console.log('rul', url)
            try {
                let body = await (await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({ face_image64: image, margin: 0.9 })
                })).json();
                console.log('got result', body);
                resolve(body);

            } catch(e) {
                console.log('error', e)
                reject(e);
            }
        });
    }

    /// private helpers /////////////
    private makeUrl(func: string) {
        const urlbase: string = `http://${Config.frs.ip}:${Config.frs.apiPort}/frs/cgi`;
        return `${urlbase}/${func}`;
    }
    private waitForLogin() {
        return this.sjLogined.getValue() === true ? null :
            this.sjLogined.filter(val => val === true).first().toPromise();
    }
    private waitForRecover() {
        return this.sjRecovered.getValue() === true ? null :
            this.sjRecovered.filter(val => val === true).first().toPromise();
    }
    /////////////////////////////////
}

export default new FRSService();
