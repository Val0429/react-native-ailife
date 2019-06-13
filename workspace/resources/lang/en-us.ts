import { RegisterLang } from './../../../core/lang';

@RegisterLang("en-us", "English")
export default class LangObject {
    
    f_enrolled="Enrolled user";
    f_FirstLogin="First Login";

    f_community = "community";
    f_Household = "Household";

    l_login="Login"
    l_account=" Account";
    l_password=" Password";
    l_remeber=" remeber me";
    l_nothave=" not enrolled";
    l_first="first login";

    s_title="Setting";
    s_info ="Nornal";
    s_birthday= "Birthday";
    s_name=  "Name";
    s_message= "After the basic information is confirmed, it cannot be modified. Please confirm that the input data is correct.."
    s_contact = "Contact"
    s_phone = "Phone number";
    s_line = "LineID";
    s_setting = "Setting";
    s_account = "Account";
    s_password = "Password";
    s_passwords = "Password";
    s_createAccount = "Create Account";


    w_Common = "Common";
    w_Community = "Community";
    w_Mail = "Mail";
    w_Resident = "Resident";
    w_Start = "Start";
    w_Vote = "Vote";
    w_Weather = "Weather";

    m_CommunityAnnouncement = "Announcement";
    m_CommunityCalendar = "Community Calendar";
    m_ContactManagementCommittee = "Contact Committee";
    m_DepositItem = "Deposit Item";
    m_FacilityReservation = "Facility Reservation";
    m_ItemBorrowing = "Item Borrowing";
    m_PersonalMessage = "My Message";
}

type ClassToInterface<T> = {
    [P in keyof T]: T[P];
}
export type ILang = ClassToInterface<LangObject>;
