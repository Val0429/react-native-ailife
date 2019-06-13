export enum Modes {
    Video = 0,
    Digital = 1,
    Attendance = 2
}
//export const modesText = ["Video", "Digital Signage", "Attendance Taking"];
export const modesText = ["ModeVideo", "ModeDigitalSignage"];

export interface SettingsModes {
    modes?: Modes;
}

const value: SettingsModes = {
    modes: Modes.Video
}

export default value;