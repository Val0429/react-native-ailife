import { iSAPServerBase, ApisRequestBase, InputR, OutputR } from './../../../helpers/restful';
import { StorageInstance as Storage ,SettingsUserInfo,SettingsServerInfo} from './../../config';

interface RestfulRequest extends ApisRequestBase { 
    "Get": { 
        "/public-notify": [AnnouncementsGet.Input, AnnouncementsGet.Output, true],
        "/package/posting":[PackageGet.Input, PackageGet.Output, true],
        "/package/receive":[PackageGet.Input, PackageGet.Output, true],
        "/package/return":[ReturnGet.Input, ReturnGet.Output, true],
        "/visitor":[VistorGet.Input, VistorGet.Output, true],
        "/gas":[GasGet.Input, GasGet.Output, true],
        "/manage-cost":[ManageCostGet.Input, ManageCostGet.Output, true],
        "/public-article":[ArticleGet.Input, ArticleGet.Output, true],
        "/public-article/reservation":[ArticleReservationGet.Input, ArticleReservationGet.Output, true],
        "/listen":[ContactGet.Input, ContactGet.Output, true],
        "/vote/history":[VoteGet.Input, VoteGet.Output, true],
        "/public-facility":[ＦacilityGet.Input, ＦacilityGet.Output, true],
        "/public-calendar":[CalendarGet.Input, CalendarGet.Output, true],
        "/public-facility/available-time":[AvailableTimeGet.Input, AvailableTimeGet.Output, true],
        "/public-facility/reservation":[FacilityReservationGet.Input, FacilityReservationGet.Output, true],
    }, 
    "Post": { 
        "/user/resident/login": [UsersLoginAll.Input,any, false], 
        "/user/resident/info" :[UsersInfo.Input,any, false],
        "/users/logout": [UsersLogoutPost.Input, any, true], 
        "/public-article/reservation": [ArticlePost.Input, ArticlePost.Output, true], 
        "/listen":[ContactPost.Input, ContactPost.Output, true],
        "/public-facility/reservation":[ReservationPost.Input, ReservationPost.Output, true],
      
        
    },
    "Put": { 
        "/user/base/password": [UsersPAssword.Input,any, false], 
        "/user/resident/info" :[EditUsersInfo.Input,any, false],
        "/gas":[UpdateGas.Input, UpdateGas.Output, true],
        "/vote/voting":[Voting.Input, Voting.Output, true],
        "/user/resident/device":[Device.Input, Device.Output, true],
        
    },
    // "Ws": {
    //     "/users/alive": [any, any, true], 
    //     "/agents/connect": [any, any, true], 
    // }, 
}

export class SmartCommunityServer extends iSAPServerBase<RestfulRequest> { 

}

export default new SmartCommunityServer({
   ip: "172.16.10.21",
   port: 6060
    // ip: "172.16.10.21",
    // port: 16060
});

/// /users/login - All ///////////////////////////////////// 
declare namespace UsersLoginAll { 
    export interface Input { 
        account: string; 
        password: string; 
    } 

    export interface Output { 
        sessionId: string;
        userId: string;
        roles:string[];
        serverTime: Date;  
    } 
} 

/// /users/login - All ///////////////////////////////////// 
declare namespace UsersPAssword { 
    export interface Input { 
        sessionId: string; 
        previous: string; 
        current: string; 
    } 

    export interface Output { 
       
    } 
} 

declare namespace UsersInfo { 
    export interface Input { 
        account: string;
        password: string;
        barcode:string;
        name: string;
        gender: number;
        birthday:string; 
        phone: string;
        lineId: string;
        email:string;
        education: string;
        career:string
    } 

        export interface Output { 
        sessionId: string; 
        serverTime: Date; 
        user: string; 
    } 
} 




declare namespace EditUsersInfo { 
    export interface Input { 
        sessionId: string;
        phone: string;
        lineId: string;
        email:string;
        education: string;
        career:string;
        isEmail:boolean;
        isNotice:boolean;
        } 

        export interface Output { 
        sessionId: string; 
        serverTime: Date; 
        user: string; 
    } 
} 

////////////////////////////////////////////////////////////// 
/// /users/logout - Post ///////////////////////////////////// 
declare namespace UsersLogoutPost { 
    export interface Input { 
    sessionId: string; 
    } 
} 
////////////////////////////////////////////////////////////// 
/// /announcements - Get /////////////////////////////////////



export declare namespace DrawBacCodeGet { 
    export interface IAnnouncements {
        /**
        * Title of announcements.
        */
        title: string;
        
        /**
        * Content of announcements.
        */
        content?: string;
    }
    export type Input = InputR<IAnnouncements>;
    export type Output = OutputR<IAnnouncements>;
}

export declare namespace GasGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        deadline: string,
        degree:number,
        status:string,
        gasId:string
    } 
}

export declare namespace ManageCostGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        status: number,
        parkingCost:number,
        manageCost:number,
    } 
}

declare namespace ArticlePost { 
    export interface Input { 
        sessionId: string;
        publicArticleId:string;
        residentId:string;
        lendCount:number
      
    }
    export interface Output { 
        reservationId: string; 
    }          
} 

export declare namespace AnnouncementsGet { 
    export interface Input { 
        sessionId: string
    } 

    export interface Output {
        publicNotifyId:string,
        date: Date,
        title: string,
        content:string,
        x:string;
        attachmentSrc:string
    } 
}


export declare namespace ＦacilityGet { 
    export interface Input { 
        sessionId: string
    } 

    export interface Output {
        publicFacilityId:string,
        name: string,
        description: string,
        limit:number,
        openDates:dateFormate[],
        maintenanceDates:dateFormate[],
        facilitySrc:string,
        pointCost:number,
    } 

    export interface dateFormate{
        startDay :string,
        endDay :string,
        startDate :Date,
        endDate :Date,
    }
}
export declare namespace CalendarGet { 
    export interface Input { 
        sessionId: string,
        // start:Date,
        // end:Date
    } 

    export interface Output {
        publicCalendarId:string,
        date:dateFormate,
        title: string,
        content: string,
        limit:number,
        facilitySrc:string,
        pointCost:number,
    } 

    export interface dateFormate{
        startDate :Date,
        endDate :Date,
    }
}

export declare namespace ArticleGet { 
    export interface Input { 
        sessionId: string
    } 

    export interface Output {
        publicArticleId:string,
        name: string,
        type: string,
        adjustCount:number,
        lendCount:number
    } 
}

export declare namespace AvailableTimeGet { 
    export interface Input { 
        sessionId: string,
        publicFacilityId:string,
        date:Date
    } 

    export interface Output {
        hours:string[]
    } 
}


export declare namespace ArticleReservationGet { 
    export interface Input { 
        sessionId: string,
        status:string
    } 

    export interface Output {
        articleName:string,
        lendCount: string,
        status:string
        replyDate:Date
    } 
}

export declare namespace FacilityReservationGet { 
    export interface Input { 
        sessionId: string
    } 

    export interface Output {
        publicFacilityname:string,
        publicFacilityLimit: string,
        publicFacilityPointCost:number,
        reservationDates:ReservationDate,
        count:number
    } 
    export interface ReservationDate { 
        startDate: Date; 
        endDate: Date; 
    }  
}

export declare namespace ContactGet { 
    export interface Input { 
        sessionId: string,
        status:string
    } 

    export interface Output {
        listenId:string,
        date:Date,
        title:string,
        content: string,
        status:string,
        attachmentSrc:string
        replys:Reply[]
    } 
    export interface Reply {
        id:string,
        name:Date,
        title:string,
        content: string,
        date:string
    } 
}

export declare namespace VoteGet { 
    export interface Input { 
        sessionId: string,
        status:string
    } 

    export interface Output {
        voteId:string,
        date:Date,
        title:string,
        content: string,
        status:string,
        deadline:Date,
        sponsorName:string,
        options:string[],
        option:string
    } 
   
}
declare namespace ContactPost { 
    export interface Input { 
        sessionId: string;
        residentId:string;
        title:string;
        content:string;
        attachment? :string
      
    }
    export interface Output { 
        listenId: string; 
    }          
} 

declare namespace ReservationPost { 
    export interface Input { 
        sessionId: string;
        publicFacilityId:string;
        residentId:string;
        count:number,
        reservationDates:reservationDate
      
    }
    export interface Output { 
        listenId: string; 
    }      
    
    export interface reservationDate { 
        startDate: Date; 
        endDate: Date; 
    }  
} 



export declare namespace UpdateGas { 
    export interface Input { 
        sessionId: string; 
        gasId: string; 
        degree: number; 
        } 

    export interface Output {
        date: string,
        deadline: string,
        degree:string,
        status:string,
        gasId:string
    } 
}

export declare namespace Voting { 
    export interface Input { 
        sessionId: string; 
        voteId: string; 
        option: string; 
        } 

    export interface Output {
        voteResult: string,
      
    } 
}

export declare namespace Device { 
    export interface Input { 
        sessionId: string; 
        deviceToken: string; 
        deviceType: string; 
    } 

    export interface Output {
        result: string,
      
    } 
}

export declare namespace MessageGet { 
    export interface IMessage {
        title: string;
        content: string;
        time: string;
        type: Boolean;
        detail :any;
    }
    export type Input = InputR<IMessage>;
    export type Output = OutputR<IMessage>;
}

export declare namespace PackageGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        receiver: string,
        sender: string,
        status:string,
        packageSrc: any
    } 
}

export declare namespace MailGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        receiver: string,
        sender: string,
        status:string
    } 
}


export declare namespace ReturnGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        receiver: string,
        sender: string,
        status:string
    } 
}

export declare namespace VistorGet { 
    export interface Input { 
        sessionId: string; 
        status: string; 
        } 

    export interface Output {
        date: string,
        name: string,
        purpose: string,
        memo:string,
        status:string
    } 
}

