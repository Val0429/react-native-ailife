import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("zh-cn", "简体中文")
export default class LangObject implements ILang {
    w_Display = "显示";
    w_General = "一般";
    w_ModeSelection = "模式";
    w_Server = "服务器";
    w_Settings = "设置";
    w_Start = "开始";

    m_LoginFRSFailed = "FRS登入失败。";    
    m_ModeVideo = "视频模式";
    m_ModeDigitalSignage = "欢迎光临模式";

    w_CompanyName = "公司名称";
    m_VideoSourceSelection = "影像来源选择";
    m_VideoSourceUrl = "影像来源URL";
    m_FaceRecognitionSource = "人脸辨识来源";
    m_RestartRequired = "警示: 修改本页需要重启App才能产生效果。";
    m_ShowStranger = "显示陌生人";
    m_MergeFaceDuration = "合并人脸持续时间 (秒)";
    w_Ip = "IP";
    w_Account = "帐号";
    w_Password = "密码";
    w_APIPort = "API Port";
    w_SocketPort = "Socket Port";
    w_Language = "语言";
    w_Others = "其他";
    w_About = "关于";
    w_MyLocation = "我的位置";
    w_Latitude = "纬度";
    w_Longitude = "经度";
    w_GreetingMessage = "欢迎讯息";
    w_Morning = "早上";
    w_Afternoon = "中午";
    w_Evening = "晚上";
}
