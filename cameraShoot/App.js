import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import * as firebase from "firebase";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { MonoText } from './components/StyledText';
import {Button,Text} from "native-base";


export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      photo: "",
    }
    firebaseConfig = {
      apiKey: 'AIzaSyCv4tO_o4jqL9sb0F7rE5F2UKi4zii73Hk',
      authDomain: 'ultra-might-264612.firebaseapp.com',
      databaseURL: 'https://ultra-might-264612.firebaseio.com',
      storageBucket: 'ultra-might-264612.appspot.com',
      messagingSenderId: "696843742936",
    };
    firebase.initializeApp(firebaseConfig);
  }
    uploadImage = async (uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      var storageRef = firebase.storage().ref();
      var mountainsRef = storageRef.child('pic2');
      mountainsRef.put(blob)
      console.log("==>",mountainsRef);
      return mountainsRef;
      // var ref = firebase.storage().ref().child("mountains.jpg");
      // return ref.put(blob);
    }  
    // var storage = firebase.storage();
  async componentDidMount() {
    try {
      // this.connect();
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
    } catch (error) {
      console.log(error)
    }
  }
  async snapPhoto() {       
    console.log('Button Pressed');
    if (this.camera) {
       console.log('Taking photo');
       const options = { quality: 1, base64: true, fixOrientation: true, 
       exif: true};
       let photo = await this.camera.takePictureAsync();
       console.log(photo.uri);
       var res = await this.uploadImage(photo.uri);
        return res;
     }
  }

  repeat = () => {
    var c = 0;
    var self = this
    var timeout = setInterval(function() {
      console.log(c);
      c++;
      self.snapPhoto().then(data=>{
          console.log("data");
      });
      if (c > 100) {
        clearInterval(timeout);
      }
    }, 7000);
  }

  changeFirstTime = () =>{
    if (this.state.firstTime){
      this.setState({firstTime:false})
    }
  }
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
        if (this.state.firstTime){
          return (
            <View>
             <View style={{ width: "100%", height: "100%" }}>
            <Camera 
              ref={ref => {
                this.camera = ref;
              }}
              style={{ flex: 1 }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type:
                        this.state.type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.back
                          : Camera.Constants.Type.back,
                    });
                  }}>        
                </TouchableOpacity>
              </View>
              <View style={{marginLeft:150,marginBottom:150}}>
              </View>
            </Camera>
            <TouchableOpacity onPress = {()=>{
                  // this.uploadImage("ewfw","fwefw");
                  // this.keepCalling();
                  //this.snapPhoto();
                  this.repeat();
                  }} >
              <Image style={{marginLeft:180, width:50,height:50}}source={require("./assets/images.png")}/>
            </TouchableOpacity>
          </View>
            </View>
          );
        } else {
          return (
            <View>
            <View style={{ width: "100%", height: "90%" }}>
           <Camera 
             ref={ref => {
               this.camera = ref;
             }}
             style={{ flex: 1 }} type={this.state.type}>
             <View
               style={{
                 flex: 1,
                 backgroundColor: 'transparent',
                 flexDirection: 'row',
               }}>
               <TouchableOpacity
                 style={{
                   flex: 0.1,
                   alignSelf: 'flex-end',
                   alignItems: 'center',
                 }}
                 onPress={() => {
                   this.setState({
                     type:
                       this.state.type === Camera.Constants.Type.back
                         ? Camera.Constants.Type.back
                         : Camera.Constants.Type.back,
                   });
                 }}>        
               </TouchableOpacity>
             </View>
           </Camera>
           <TouchableOpacity onPress = {()=>{
            //  this.uploadImage("ewfw","fwefw");
            // this.keepCalling();
            //this.snapPhoto();
            this.repeat()
              }} >
             <Image style={{marginLeft:160, width:80,height:80}}source={require("./assets/images.png")}/>
           </TouchableOpacity>
         </View>
           </View>
          
          );
        }
    }
  }
}

HomeScreen.navigationOptions = {
  title: "Verification",
};


function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});