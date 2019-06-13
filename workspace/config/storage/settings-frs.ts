export interface SettingsFRS {
    ip?: string;
    account?: string;
    password?: string;
    apiPort?: string;
    socketPort?: string;
}

const value: SettingsFRS = {
    apiPort: "8088",
    socketPort: "7077"
};

export default value;