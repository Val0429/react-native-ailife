export enum DisplayList {
    register = 0x0001,
    unregister = 0x0002,
    vip = 0x0004,
    blacklist = 0x0008
}

export interface SettingsDisplay {
    faceDisplayTime?: number;
    faceMergeTime?: number;
    displayFacePicture?: boolean;
    companyName?: string;
    textColor?: string;
    VIPColor?: string;
    blackListColor?: string;
    displayList?: number;
}

const value: SettingsDisplay = {};

export default value;