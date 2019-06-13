export enum VideoPlayMode {
    all = 0,
    single = 1
}

export interface SettingsAttendance {
    location?: string;
    faceDetectionTime?: string;
    videoPlayMode?: VideoPlayMode;
    ip?: string;
    account?: string;
    password?: string;
    port?: string;
}

const value: SettingsAttendance = {
    faceDetectionTime: "30"
}

export default value;