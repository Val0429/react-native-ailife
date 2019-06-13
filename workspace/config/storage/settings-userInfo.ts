
export interface SettingsUserInfo {
    account?: string;
    password?: string;
    barcode?:string;
    name?: string;
    gender?: number;
    birthday?:string; 
    phone?: string;
    lineId?: string;
    email?:string;
    education?: string;
    career?:string;
    sessionId?:string;
    residentId?:string;
    userId?:string;
    barcodeImage?:string;
    remeberPassword?:boolean;
    isEmail:boolean;
    isNotice:boolean;
}

const value: SettingsUserInfo = {
    education:"博士",
    birthday:"1980/01/01",
    career:"軍公教",
    remeberPassword:true,
    isEmail:true,
    isNotice:true

};

export default value;