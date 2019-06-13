import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("pt", "português")
export default class LangObject implements ILang {
    w_Display = "visualização";
    w_General = "geral";
    w_ModeSelection = "Modo";
    w_Server = "servidor";
    w_Settings = "configurações";
    w_Start = "começar";

    m_LoginFRSFailed = "O login do FRS falhou.";
    m_ModeVideo = "Vídeo";
    m_ModeDigitalSignage = "Exibição de boas-vindas";

    w_CompanyName = "Nome da empresa";
    m_VideoSourceSelection = "Seleção de fonte de vídeo";
    m_VideoSourceUrl = "URL de origem de vídeo";
    m_FaceRecognitionSource = "Fonte de Reconhecimento Facial";
    m_RestartRequired = "Aviso: o reinício necessário para que as alterações nesta página entrem em vigor.";
    m_ShowStranger = "Mostrar estranho";
    m_MergeFaceDuration = "Mesclar a Duração da Face (segundos)";
    w_Ip = "IP";
    w_Account = "Conta";
    w_Password = "Senha";
    w_APIPort = "Porta API";
    w_SocketPort = "Porta de soquete";
    w_Language = "Língua";
    w_Others = "Outros";
    w_About = "Sobre";
    w_MyLocation = "Minha localização";
    w_Latitude = "Latitude";
    w_Longitude = "Longitude";
    w_GreetingMessage = "Mensagem de saudação";
    w_Morning = "Manhã";
    w_Afternoon = "Tarde";
    w_Evening = "Noite";
}