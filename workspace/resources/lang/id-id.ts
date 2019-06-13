import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("id-id", "Bahasa indonesia")
export default class LangObject implements ILang {
    w_Display = "Tampilan";
    w_General = "Umum";
    w_ModeSelection = "Mode";
    w_Server = "Server";
    w_Settings = "Pengaturan";
    w_Start = "Mulai";

    m_LoginFRSFailed = "Login ke FRS gagal.";
    m_ModeVideo = "Video";
    m_ModeDigitalSignage = "Tampilan Selamat Datang";

    w_CompanyName = "Nama Perusahaan";
    m_VideoSourceSelection = "Pemilihan Sumber Video";
    m_VideoSourceUrl = "Url Sumber Video";
    m_FaceRecognitionSource = "Sumber Pengenalan Wajah";
    m_RestartRequired = "Peringatan: mulai ulang diperlukan untuk membuat perubahan pada halaman ini berlaku.";
    m_ShowStranger = "Tampilkan Orang Asing";
    m_MergeFaceDuration = "Gabungkan Durasi Wajah (detik)";
    w_Ip = "AKU P";
    w_Account = "Rekening";
    w_Password = "Kata sandi";
    w_APIPort = "Port API";
    w_SocketPort = "Port soket";
    w_Language = "Bahasa";
    w_Others = "Lainnya";
    w_About = "Tentang";
    w_MyLocation = "Lokasi saya";
    w_Latitude = "Lintang";
    w_Longitude = "Garis bujur";
    w_GreetingMessage = "Pesan Ucapan";
    w_Morning = "Pagi";
    w_Afternoon = "Sore";
    w_Evening = "Malam";
}