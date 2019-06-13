
export interface ReadedCount {
    totalReadedCount: ReadedItem[];
   
}
export interface ReadedItem{
    managerReadedCount: number;
    packageReadedCount: number;
    mailReadedCount: number;
    returnReadedCount: number;
    vistorReadedCount: number;
    gasReadedCount: number;
    voteReadedCount: number;
    contactReadedCount: number;
    announcmentReadedCount :number;
    updataStatus : boolean,
    account:string
}

const value: ReadedCount = {
    totalReadedCount:[],
   
};

export default value;