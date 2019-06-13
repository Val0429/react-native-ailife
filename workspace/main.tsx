import React, {Component} from 'react';
import { Router, Stack, Scene, Actions } from 'react-native-router-flux';
import './resources/lang';
import { StorageInstance as Storage } from './config';
import { Root, Toast } from 'native-base';
import { Subscription } from 'rxjs';
import frs from './services/frs-service';
import { WelcomeContent } from './contents/welcome';
import { FirstContent } from './contents/first';

import { LoginContent } from './contents/login';
import { MainContent } from './contents/main-pages';
import { NewPersonContent } from './contents/new-person';
import lang, { _ } from './../core/lang';
import { AnnouncementPage } from './contents/main-pages/pages/community/announcement-page';
import { GasPage } from './contents/main-pages/pages/resident/gas-page';
import { MessagePage } from './contents/main-pages/pages/resident/message-page';
import { PackagePage } from './contents/main-pages/pages/resident/package-page';
import { MailPage } from './contents/main-pages/pages/resident/mail-page';
import { ReturnPage } from './contents/main-pages/pages/resident/return-page';
import { VistorPage } from './contents/main-pages/pages/resident/vistor-page';
import { ToolPage } from './contents/main-pages/pages/community/tool-page';
import { ManagePage } from './contents/main-pages/pages/resident/manager-page';
import { ContactPage } from './contents/main-pages/pages/community/contact-page';
import { CalenderPage } from './contents/main-pages/pages/community/calender-page';
import { VotePage } from './contents/main-pages/pages/community/vote-page';

import { ReservePage } from './contents/main-pages/pages/community/reserve-page';

import { AnnouncementDetaiPage } from './contents/main-pages/pages/community/announcementDetai-page';


import { AccountInfoPage } from './contents/main-pages/pages/setting/accountInfo-page';
import { EditPasswordPage } from './contents/main-pages/pages/setting/editPassword-page';
import { EditInfoPage } from "./contents/main-pages/pages/setting/editInfo-page";
import { VoteDetaiPage } from "./contents/main-pages/pages/community/voteDetai-page";
import { ReserveDetaiPage } from "./contents/main-pages/pages/community/reserveDetai-page";


class App extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { ready: false }
    }
    componentWillMount() {
        Storage.ready.subscribe( (ready) => {
            this.setState({ready});
            /// set lang
            let settingsLanguage = Storage.get("settingsLanguage");
            lang.setLang(settingsLanguage.lang);  
            
           
        });
     
    }
    
  

    render() {
        return this.state.ready ? (
            <Root>
                <Router>
                    <Stack key="root" hideNavBar={true}>
                    <Scene key="login" component={LoginContent} /> 
                        <Scene key="newperson" component={NewPersonContent} />
                       
                        <Scene key="main" component={MainContent} />
                       
                        
                        <Scene key="announcementDetai" component={AnnouncementDetaiPage} />
                        <Scene key="voteDetai" component={VoteDetaiPage} />
                        <Scene key="editInfo" component={EditInfoPage} /> 
                        <Scene key="reserveDetail" component={ReserveDetaiPage} /> 
                        <Scene key="editPassword" component={EditPasswordPage} />
                        <Scene key="accountInfo" component={AccountInfoPage} />
                        <Scene key="first" component={FirstContent} />
                        <Scene key="welcome" component={WelcomeContent} />
                        <Scene key="reserve" component={ReservePage} />
                        <Scene key="vistor" component={VistorPage} />
                        <Scene key="vote" component={VotePage} />
                        <Scene key="calender" component={CalenderPage} />
                        <Scene key="contact" component={ContactPage} />
                        <Scene key="announcement" component={AnnouncementPage} />
                        <Scene key="tool" component={ToolPage} />
                        <Scene key="message" component={MessagePage} />
                        <Scene key="mail" component={MailPage} />
                        <Scene key="manage" component={ManagePage} />
                        <Scene key="returns" component={ReturnPage} />
                        <Scene key="package" component={PackagePage} />
                       
                        <Scene key="gas" component={GasPage} />
                        
                    </Stack>
                </Router>
            </Root>
        ) : null;
    }
}
export default App;
