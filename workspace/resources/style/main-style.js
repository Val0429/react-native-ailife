import { StyleSheet } from 'react-native';
import Device from '../../contents/react-native-device-detection-val';
import EStyleSheet from 'react-native-extended-stylesheet';

const iStyle = EStyleSheet.create({
    imgBackground:{
        width: '100%',
        height: '100%',
        flex: 1 ,
        margin:0,
        padding:0,
    },
    headerBackground:{
        width: '100%',
        margin:0,
        padding:0
    },
    viewBackgorundColor:{
      backgroundColor: "$bgColor"

    },
    mainView:{
      backgroundColor:'rgb(241,243,241)',
      justifyContent:"flex-start",
      minHeight:300
  },

    center:{
        alignSelf: 'center', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    no_border: {
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item_button: {
      width: '80%',
      ...Device.select({
            phone: { height: 55,borderRadius: 5 },
            tablet: {  height: 55,borderRadius: 5 }
            }),
      backgroundColor: '$mainPurple'
      },
    alert_button: {
          ...Device.select({
              phone: { height:40,width:180,borderRadius: 5 },
              tablet: { height:80,width:180,borderRadius: 5 }
              }),
          backgroundColor: '$mainYellow'},
    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        ...Device.select({
          phone: {  height: 55, borderRadius: 7, marginTop: 20 },
          tablet: {  height: 55, borderRadius: 7, marginTop: 5 }
        })
      },
      mainTitleText:{
        fontSize:'22 rem',
        color:"$titleTextColr"
      },
      mainContetText:{
        fontSize:'20 rem',
        color:"$titleTextColr"
      },
      pageMargin:{
          marginTop:20

      },
      settingitemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
        ...Device.select({
          phone: { height: 50,  marginTop: 15 },
          tablet: { height: 50, marginTop: 15 }
        })
      },
      bottomBorder:{
        borderBottomColor:'#D5D5D5',borderBottomWidth:2
      },
      contactitemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        ...Device.select({
          phone: {  height: 55 ,borderRadius:4 , marginTop: 10 },
          tablet: {  height: 55 ,borderRadius:4  ,marginTop: 20 } 
        })
      },
      contactStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        ...Device.select({
          phone: {  height: 165 ,borderRadius:4 , marginTop: 10  },
          tablet: {  height: 165 ,borderRadius:4  ,marginTop: 20 } 
        })
      },
      gasitemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        ...Device.select({
          phone: {  height: 55,  marginTop: 10 , borderRadius: 5 },
          tablet: {  height: 60, marginTop: 10 , borderRadius: 5 }
        })
      },
      scan_button: {
        ...Device.select({
            phone: { width: 270, height: 55 ,borderRadius: 5},
            tablet: { width: 270, height: 55,borderRadius: 5 }
            }),
            borderColor: '$mainYellow',
            borderWidth:1,
            backgroundColor: '$mainYellow',
            shadowColor: 'rgba(0, 0, 0, 1)',
    },
    commu_message:{
        ...Device.select({
            phone: {fontSize:16  , borderRadius: 12 ,padding:4},
            tablet: { fontSize:16  , borderRadius: 12,padding:2}
          }),
        position: 'absolute', left: 0,top:10,
        borderColor:'$mainPurple',
        backgroundColor:'white',
        borderWidth:1
    },
    resident_message:{
        ...Device.select({
            phone: {fontSize:16  , borderRadius: 12 ,padding:4},
            tablet: { fontSize:16  , borderRadius: 12,padding:2}
          }),
        position: 'absolute', left: 0,top:10,
        backgroundColor:'$mainPurple'
    },
    full:{
        width:'100%'
    }
    
});



export default iStyle;