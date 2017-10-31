import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nani } from "../../model/nani"
import { AngularFireAuth } from "angularfire2/auth"
import { HomePage } from '../home/home'
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  nani = {} as Nani;
  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(nani: Nani) {
    console.log("debuggg",nani)
      let x = this
      this.afAuth.auth.signInWithEmailAndPassword(nani.email, nani.password).then(function () {
        var Nnani = x.afAuth.auth.currentUser;
        console.log("user", Nnani.emailVerified,"sign in" )
        if (Nnani.emailVerified) {
          console.log('omg ok')
          x.navCtrl.push(HomePage)
        } else {
          alert("you are not vertified please go to you email"+ nani.email +"to vertify you account")
        }
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("we are inside login error ")
        alert(errorMessage)
      });
  }
}
