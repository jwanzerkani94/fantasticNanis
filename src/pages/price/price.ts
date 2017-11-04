import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from "firebase";
import { AngularFireDatabase } from "angularfire2/database";

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
  information ={
    nani_id : "YdSV2gxkYoO84TtnOoOjBauEJB33" ,
    user_id : "7dfXMMQQsfN7MqpHHdYF3EBwSFX2" ,
    start_time: "7:43:16 PM"
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public db: AngularFireDatabase) {
    let database = firebase.database();
    db.object("services").valueChanges().subscribe(data => {
      this.service = data;
    });
  }
  service;
  // ionViewOnLoad(){
  //   this.showInfo();
  // }

  showInfo(){
    var naniName = document.getElementById("naniName");
    var userName = document.getElementById("userName");
    var startTime = document.getElementById("time");
    naniName.innerHTML = "";
    userName.innerHTML = "";
    startTime.innerHTML = "";
    naniName.innerHTML += this.information['nani_id'];
    userName.innerHTML += this.information['user_id'];
    startTime.innerHTML += this.information['start_time'];
  }

  calculatePrice(){
    this.stopTimer();
    let db = firebase.database();
    var currentTime = new Date(new Date().getTime()).toLocaleTimeString();
    db.ref("services/4160189").update({ end_time : currentTime });
    this.timeToMoney(this.service[4160189].start_time,currentTime);
  }

  timeToMoney(start , end) {
    console.log(start,end)
    var startTime = start.split(":")
    var endTime = end.split(":")
    var money = (Number(endTime[0])*60 + Number(endTime[1]) - Number(startTime[0])*60 - Number(startTime[1])) * (20/60);
    alert("total price : " + money) 
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
    console.log('ionViewDidLoad PricePage');
    this.showInfo();
    this.startTimer();
  }

}
