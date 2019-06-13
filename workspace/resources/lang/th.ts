import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("th", "ไทย")
export default class LangObject implements ILang {
    w_Display = "แสดง";
    w_General = "ทั่วไป";
    w_ModeSelection = "โหมด";
    w_Server = "เซิร์ฟเวอร์";
    w_Settings = "การตั้งค่า";
    w_Start = "เริ่มต้น";

    m_LoginFRSFailed = "เข้าสู่ระบบ FRS ล้มเหลว";
    m_ModeVideo = "โหมดวิดีโอ";
    m_ModeDigitalSignage = "ยินดีต้อนรับโหมดการแสดงผล";

    w_CompanyName = "ชื่อ บริษัท";
    m_VideoSourceSelection = "การเลือกแหล่งสัญญาณวิดีโอ";
    m_VideoSourceUrl = "URL แหล่งที่มาของวิดีโอ";
    m_FaceRecognitionSource = "แหล่งการจดจำใบหน้า";
    m_RestartRequired = "คำเตือน: จำเป็นต้องรีสตาร์ทเพื่อให้การเปลี่ยนแปลงหน้านี้มีผล";
    m_ShowStranger = "แสดงคนแปลกหน้า";
    m_MergeFaceDuration = "รวมระยะเวลาของใบหน้า (วินาที)";
    w_Ip = "IP";
    w_Account = "บัญชี";
    w_Password = "รหัสผ่าน";
    w_APIPort = "API พอร์ต";
    w_SocketPort = "ซ็อกเก็ตพอร์ต";
    w_Language = "ภาษา";
    w_Others = "คนอื่น ๆ";
    w_About = "เกี่ยวกับเรา";
    w_MyLocation = "ตำแหน่งของฉัน";
    w_Latitude = "ละติจูด";
    w_Longitude = "ลองจิจูด";
    w_GreetingMessage = "ข้อความทักทาย";
    w_Morning = "ตอนเช้า";
    w_Afternoon = "ตอนบ่าย";
    w_Evening = "ตอนเย็น";    
}