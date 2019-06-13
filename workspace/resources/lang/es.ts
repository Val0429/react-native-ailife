import { RegisterLang } from './../../../core/lang';
import { ILang } from './en-us';

@RegisterLang("es", "español")
export default class LangObject implements ILang {
    w_Display = "Visualización";
    w_General = "General";
    w_ModeSelection = "Modo";
    w_Server = "Servidor";
    w_Settings = "Ajustes";
    w_Start = "Comienzo";

    m_LoginFRSFailed = "El inicio de sesión de FRS falló.";
    m_ModeVideo = "Vídeo";
    m_ModeDigitalSignage = "Pantalla de bienvenida";

    w_CompanyName = "Nombre de empresa";
    m_VideoSourceSelection = "Selección de fuente de video";
    m_VideoSourceUrl = "Fuente de video url";
    m_FaceRecognitionSource = "Fuente de reconocimiento facial";
    m_RestartRequired = "Advertencia: reinicio requerido para que los cambios en esta página surtan efecto.";
    m_ShowStranger = "Mostrar Extraño";
    m_MergeFaceDuration = "Combinar la duración de la cara (segundos)";
    w_Ip = "IP";
    w_Account = "Cuenta";
    w_Password = "Contraseña";
    w_APIPort = "Puerto API";
    w_SocketPort = "Puerto de zócalo";
    w_Language = "Idioma";
    w_Others = "Otros";
    w_About = "Acerca de";
    w_MyLocation = "Mi ubicacion";
    w_Latitude = "Latitud";
    w_Longitude = "Longitud";
    w_GreetingMessage = "Mensaje de saludo";
    w_Morning = "Mañana";
    w_Afternoon = "Tarde";
    w_Evening = "Noche";
}