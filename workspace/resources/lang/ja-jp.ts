import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("ja-jp", "日本語")
export default class LangObject implements ILang {
    w_Display = "ディスプレイ";
    w_General = "一般";
    w_ModeSelection = "モード";
    w_Server = "サーバー";
    w_Settings = "設定";
    w_Start = "スタート";

    m_LoginFRSFailed = "FRSへのログインに失敗しました。";
    m_ModeVideo = "ビデオ";
    m_ModeDigitalSignage = "ウェルカムディスプレイ";

    w_CompanyName = "会社名";
    m_VideoSourceSelection = "ビデオソースの選択";
    m_VideoSourceUrl = "ビデオソースのURL";
    m_FaceRecognitionSource = "顔認識ソース";
    m_RestartRequired = "警告：このページへの変更を有効にするには再起動が必要です。";
    m_ShowStranger = "見知らぬ人を表示";
    m_MergeFaceDuration = "フェイスデュレーションのマージ (秒)";
    w_Ip = "IP";
    w_Account = "アカウント";
    w_Password = "パスワード";
    w_APIPort = "APIポート";
    w_SocketPort = "ソケットポート";
    w_Language = "言語";
    w_Others = "その他";
    w_About = "関しては";
    w_MyLocation = "現在地";
    w_Latitude = "緯度";
    w_Longitude = "経度";
    w_GreetingMessage = "挨拶メッセージ";
    w_Morning = "朝";
    w_Afternoon = "午後";
    w_Evening = "夕方";
}