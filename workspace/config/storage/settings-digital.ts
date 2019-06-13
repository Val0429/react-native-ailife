export interface SettingsDigital {
    companyName?: string;
    latitude?: string;
    longitude?: string;

    greetingMorning?: string;
    greetingAfternoon?: string;
    greetingEvening?: string;
}

const value: SettingsDigital = {
    latitude: "25.0375",
    longitude: "121.5637",

    greetingMorning: "美好的一天開始！",
    greetingAfternoon: "記得多喝水！",
    greetingEvening: "辛苦了！"
};

export default value;