import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

    let config = {
      apiKey: "AIzaSyAUipRdjwgFm76lPfFCVWH84OWKSY5S32I",
      authDomain: "fantastic-13633.firebaseapp.com",
      databaseURL: "https://fantastic-13633.firebaseio.com",
      projectId: "fantastic-13633",
      storageBucket: "fantastic-13633.appspot.com",
      messagingSenderId: "1014964753035"
    }
    
    firebase.initializeApp(config)  
    firebase.auth().onAuthStateChanged((user) => {
      console.log("is user vertified? ",user.emailVerified)
      if (user.emailVerified) {
        console.log("this should appear if the user is vertified")
        // If there's no user logged in send him to the LoginPage
        this.rootPage = HomePage;
      } else {
 
        console.log("this should appear if the user not vertified")
        // If there's a user take him to the home page.
        this.rootPage = LoginPage;
      }
    });
    const messaging = firebase.messaging();
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
