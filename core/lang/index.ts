import LangBase from './../../workspace/resources/lang/zh-tw';
import { BehaviorSubject } from 'rxjs';

type ClassToInterface<T> = {
    [P in keyof T]: T[P];
}
type ILang = ClassToInterface<LangBase>;
export const defaultLang = "zh-tw";

let langMap: { [index: string]: [string, ILang] } = {};
export function RegisterLang(name: string, description: string) {
    return (Class) => {
        langMap[name] = [description, new Class()];
    }
}

export class Lang {
    /// get all lang
    list(): { [index: string]: string } {
        return Object.keys(langMap).reduce( (final, key) => {
            final[key] = langMap[key][0];
            return final;
        }, {});
    }
    private getLangObject(name?: string): ILang {
        return langMap[defaultLang][1];
        // return !name ? langMap[this.currentLang.getValue()][1]
        //              : langMap[defaultLang][1];
    }
    translate<T extends keyof ILang>(key: T): ILang[T] {
        return this.getLangObject()[key] || `(!) ${this.getLangObject(defaultLang)[key]}`;
    }

    private currentLang: BehaviorSubject<string> = new BehaviorSubject<string>(defaultLang);
    /// set current lang name
    setLang(name: string) {
        if (!name) return;
        if (Object.keys(langMap).indexOf(name) >= 0) this.currentLang.next(name);
        else throw `Language <${name}> not exists.`;
    }
    /// get current lang name
    getLang() {
        return this.currentLang.getValue();
    }
    getLangObservable() {
        return this.currentLang.asObservable();
    }            
}

const lang = new Lang();
export default lang;

export function _(key: keyof ILang) {
    return lang.translate(key);
}