import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("zh-tw", "正體中文")
export default class LangObject implements ILang {
    version ="版本號"
    a_title = "錯誤資訊";
    a_passwordNotMatch = "密碼不符合";
    a_error="創建帳號失敗";
    a_loginError="登入失敗";
    a_editPasswordError="修改密碼失敗";
    a_sucess = "預約成功";
    a_editSucess = "修改成功"
    a_timeFail = "請選擇無人預約時段"
    a_voteSucess = "投票成功"
    a_voteFail = "投票失敗"
    a_voted = "已有投票"
    a_fail = "預約失敗"
    a_toolFail = "借用失敗"
    a_toolsucess = "借用成功";
    a_countFail = "數量不足"
    f_enrolled="已註冊登入";
    f_FirstLogin="首次登入";
    f_community = "社區條碼掃描";
    f_Household = "住戶條碼掃描";

    l_login="登入";
    l_account="帳號";
    l_password=" 密碼";
    l_remeber=" 記住帳號密碼";
    l_nothave="尚未註冊帳號？";
    l_first="首次登入註冊";
    l_pleasescan="請掃描條碼";
    l_getServerInfoSu="社區註冊成功";
    l_scan="掃描";
    l_managersacn = "請管理人員掃描條碼"
    l_enrollsu="住戶註冊成功"
    l_enrolled="已註冊帳號"

    s_title="基本資料與密碼設定"
    s_info ="基本資料"
    s_name ="姓名"
    s_birthday= "出生日期"
    s_message= "基本資料確認後將無法修改,請確認輸入資料無誤."
    s_contact = "聯絡資料";
    s_education="學歷";
    s_sex="性別"
    s_job = "職業";
    s_phone = "手機號碼";
    s_line = "LineID";
    s_save = "儲存";
    s_save_error="儲存失敗"

    s_email = "電子郵件";
    s_setting = "帳號密碼設定";
    s_account = "請輸入帳號";
    s_password = "請輸入密碼";
    s_passwords = "輸入密碼確定";
    s_createAccount = "創建帳號";
    s_accountInfo = "帳號資訊";
    s_barcode = "條碼";
    s_useaccount = "使用帳號";
    s_editPassword = "修改密碼";
    s_personinfo = "會員資訊";
    s_personinfoedit = "會員資訊修改";
    s_pushsetting = "通知設定";
    s_push = "訊息推播";
    s_logout= "登出"
    s_mail = "Mail通知";
    s_inpuOldwPassword="輸入舊密碼"
    s_inpuNewwPassword="輸入新密碼"
    s_inpuNewwPasswordCheck="輸入新密碼確認"

    w_Common = "常用";
    w_Community = "社區";
    w_Mail = "郵件";
    w_Resident = "住戶";
    w_Start = "開始";
    w_Vote = "投票";
    w_Weather = "天氣";
    w_setting = "設定"
    s_female = "女"
    s_male = "男"
    m_CommunityAnnouncement = "社區公告";
    m_CommunityAnnouncementDetail="公告內容"
    m_CommunityCalendar = "社區行事曆";
    m_ContactManagementCommittee = "聯絡管委會";
    m_DepositItem = "寄放物品";
    m_FacilityReservation = "公設預約";
    m_FacilityReservationInfo="公設資訊"
    m_ItemBorrowing = "物品借用";
    m_PersonalMessage = "我的訊息";
    m_CommunityAnnouncementRead = "已讀公告";
    m_CommunityAnnouncementUnread = "未讀公告";
    m_leave= "離開"
    r_return = "退貨";
    r_vistor = "訪客";
    r_gas = "瓦斯表登記";
    r_manage = "管理費";

    g_addGas ="輸入瓦斯度數";
    g_add ="新增紀錄";

    t_lend= "借用";
    t_checklend= "確定借用";

    c_Title ="輸入聯絡主旨";
    c_Contact ="輸入聯絡內容";
    c_name ="輸入聯絡人姓名";


    t_Tool ="工具";
    t_MagazineBook ="雜誌書籍";
    t_AccessCard ="門禁卡";
    t_Others="其他";
    t_lendCount= "借用數量"
    t_count= "個"

    c_listening="詢問中"
    c_listened="已回覆"
    c_contentDetail="詢問內容"
    c_namer="發起人"
    c_file="附加檔案"
    c_have="有"
    c_dont="無"
    c_replyDate="回覆日期"
    c_replyContent="回覆內容"
    c_replyname="回覆人";
    
    v_deadline = "投票截止日"
    v_content = "說明內容"
    v_items = "投票選項"
    v_number = "號"
    v_checkvote= "確定投票";

    v_vistorInfo = '訪客訊息'
    v_vistorRecore = '訪客紀錄'
    v_vistorName= '訪客名稱'
    v_vistorPurpose= '拜訪目的'
    v_note= "備註"
    re_opentime="開放時間";
    re_dec="設備簡介"
    re_limit="人數限制"
    re_bonus="點數扣點"
    re_people="人"
    re_pointCost="點/人"
    re_weel="週"
    re_andweel="至週"
    re_open ="開放"
    re_reservation = "預約";

    m_nomessage = "無未讀訊息"
    m_nopackage = "無寄放物品"
    m_nodata = "暫無資料"

    g_nowMonth = "本期登記"
    g_month = "每月度數"
    g_addnew = "新增本期度數"
    g_gas = "瓦斯表度數"
    m_norecordmail = "未領郵件"
    m_recordmail = "已領紀錄"

    m_record = "收件"
    m_norecord = "已取件"

    m_sender = "寄件人"
    m_re = "收件人"
    m_rec = '預約'

    r_checkDate= "請選擇日期";
    r_checkTime= "請選擇時段";
    r_nocantime= "無可使用時段";
    r_checkperson= "請選擇人數";
    r_checkreserve= "確定預約";

    r_point= "花費點數";

    r_timeRange ="預約時段"
    r_personCount ="預約人數"
}