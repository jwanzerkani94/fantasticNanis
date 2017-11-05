import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from "firebase";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the PricePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-price',
  templateUrl: 'price.html',
})
export class PricePage {
  service;
  nanis;
  users;
  money;
  constructor(private afAuth: AngularFireAuth,
              public navCtrl: NavController, public navParams: NavParams,
              public db: AngularFireDatabase,
              public alertCtrl: AlertController) {
    db.object("services").valueChanges().subscribe(data => {
      this.service = data;
    });
    let database = firebase.database();
    db.object("nani").valueChanges().subscribe(data => {
        this.nanis = data;
    });
    db.object("users").valueChanges().subscribe(data => {
      this.users = data;
    });
    let that = this
    database.ref('/active').on('value', function(snapshot) {
     let objectOfServices = snapshot.val();
     var Nnani = afAuth.auth.currentUser;
     for(var keyy in objectOfServices){
       if(Nnani.uid===objectOfServices[keyy].nani_id){
        that.sessionId = keyy
         console.log("ppppppppppprice",objectOfServices[keyy].user_position, keyy)
       }
     }

   });
  }
  sessionId;
  // ionViewOnLoad(){
  //   this.showInfo();
  // }
  showInfo(){
    let service_id;
    let user_id;
    let nani_id;
    for(var key in this.service){
      //this needs to be solved when we connect the apps
      if(key === this.sessionId){
        service_id = key;
        nani_id = this.service[key].nani_id;
        user_id = this.service[key].user_id;
      }
    }
    var naniName = document.getElementById("naniName");
    var userName = document.getElementById("userName");
    var startTime = document.getElementById("time");
    naniName.innerHTML = "";
    userName.innerHTML = "";
    startTime.innerHTML = "";
    naniName.innerHTML += this.nanis[nani_id].firstName +" "+ this.nanis[nani_id].lastName;
    userName.innerHTML += this.users[user_id].firstName +" "+ this.users[user_id].lastName;
    startTime.innerHTML += this.service[service_id].start_time;
  }

  calculatePrice(){
    this.stopTimer();
    let db = firebase.database();
    var currentTime = new Date(new Date().getTime()).toLocaleTimeString();
    //also this line 
    db.ref("services/"+this.sessionId).update({ end_time : currentTime });
    this.timeToMoney(this.service[this.sessionId].start_time,currentTime);
    db.ref("active/"+this.sessionId).remove();
  }

  timeToMoney(start , end) {
    let x = this;
    var startTime = start.split(":")
    var endTime = end.split(":")
    console.log("time to money",startTime , endTime )
    this.money = (Number(endTime[0])*60 + Number(endTime[1]) - Number(startTime[0])*60 - Number(startTime[1])) * (20/60);
    // alert("total price : " + money) 
    let alert = this.alertCtrl.create({
      title: 'Total Price :',
      subTitle: x.money,
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(HomePage);
  }

  seconds = 0;
  minutes = 0;
  hours = 0;
  timeOut;

  startTimer(){
    let x = this;
    x.timeOut = setInterval(function addSeconds(){
      x.seconds++;
      if(x.seconds >= 60){
        x.seconds = 0;
        x.minutes++;
        if(x.minutes >= 60){
          x.minutes=0;
          x.hours++;
        }
      }
      var timer = document.getElementById("timer");
      timer.innerHTML = "";
      timer.innerHTML += x.hours + ":" + x.minutes + ":" + x.seconds;
    },1000)
  }

  stopTimer(){
    clearInterval(this.timeOut);
  }
  

  ionViewDidLoad() {
    let x = this;
    console.log('ionViewDidLoad PricePage');
    var timeOut = setTimeout(function(){
      x.showInfo()
    },200);
    this.startTimer();
  }
}
