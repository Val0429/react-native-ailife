//import StoragePool from 'sync-storage';
import { AsyncStorage as StoragePool } from 'react-native';
// import StoragePool from 'react-native-sync-localstorage';
import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Storage } from './../../helpers/storage';


import settingsModes, { SettingsModes } from './storage/settings-modes';
import settingsVideo, { SettingsVideo } from './storage/settings-video';
import settingsDigital, { SettingsDigital } from './storage/settings-digital';
import settingsAttendance, { SettingsAttendance } from './storage/settings-attendance';
import settingsDisplay, { SettingsDisplay } from './storage/settings-display';
import settingsFRS, { SettingsFRS } from './storage/settings-frs';
import settingsDGS, { SettingsDGS } from './storage/settings-dgs';
import settingsBasic, { SettingsBasic } from './storage/settings-basic';
import settingsLanguage, { SettingsLanguage } from './storage/settings-language';
import settingsUserInfo, { SettingsUserInfo } from './storage/settings-userInfo';
import settingsServerInfo, { SettingsServerInfo } from './storage/settings-serverInfo';
import settingsAnnouncement, { SettingsAnnouncement } from './storage/settings-announcement';
import readedCount, { ReadedCount } from './storage/read-count';

export interface IStorage {
    settingsBasic: SettingsBasic;
    modes: SettingsModes;
    settingsVideo: SettingsVideo;
    settingsDigital: SettingsDigital;
    settingsAttendance: SettingsAttendance;
    settingsDisplay: SettingsDisplay;

    settingsFRS: SettingsFRS;
    settingsDGS: SettingsDGS;
    settingsLanguage: SettingsLanguage;
    settingsUserInfo: SettingsUserInfo;
    settingsServerInfo: SettingsServerInfo;
    settingsAnnouncement: SettingsAnnouncement;
    readedCount: ReadedCount
}

const storage: IStorage = {
    settingsBasic,
    modes: settingsModes,
    settingsVideo,
    settingsDigital,
    settingsAttendance,
    settingsDisplay,
    settingsFRS,
    settingsDGS,
    settingsLanguage,
    settingsUserInfo,
    settingsServerInfo,
    settingsAnnouncement,
    readedCount
}

const StorageInstance = new Storage(storage);
export { StorageInstance }
