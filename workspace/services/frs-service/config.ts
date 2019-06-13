import {StorageInstance as Storage, SettingsFRS, SettingsDGS } from './../../config';

interface SettingsFTS {
    specialScoreForUnRecognizedFace: number;
    throttleKeepSameFaceSeconds: number;
}

export interface IConfig {
    frs: SettingsFRS;
    dgs: SettingsDGS;
    fts: SettingsFTS;
}
const Config: IConfig = {
    frs: Storage.get("settingsFRS"),
    dgs: Storage.get("settingsDGS"),
    fts: {
        specialScoreForUnRecognizedFace: 0.6,
        throttleKeepSameFaceSeconds: 15
    }
}
Storage.getSubject("settingsFRS").subscribe(d => Config.frs = d);
Storage.getSubject("settingsDGS").subscribe(d => Config.dgs = d);
export { Config };
