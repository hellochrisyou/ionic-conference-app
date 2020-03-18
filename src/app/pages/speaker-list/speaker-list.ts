import { User, Messages } from './../../shared/models';
import { AuthService } from './../../core/service/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  userRef: AngularFirestoreDocument<any>;
  user: User = {};
  public message: string;
  usersCollection: any;

  constructor(

    private afs: AngularFirestore,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public confData: ConferenceData, ) { }

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
    this.userRef = this.afs.doc(`messaging/${this.authService.authState.email}`);

    this.userRef.get().subscribe(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        this.user = doc.data();
      }
    }, (err => {
      // console.log('Error fetching document: ', err);
    }));
  }

  async sendMessage(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Send Message',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (dataMessage: any) => {

            const data: Messages = {
              sender: this.authService.authState.displayName,
              receiver: this.speakers[index].name,
              message: dataMessage.message
            };
            this.updateMessageStore(data, index);
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'message',
          value: this.message,
          placeholder: 'message'
        }
      ]
    });
    await alert.present();
  }

  public updateMessageStore(data: Messages, index: number) {
    console.log('data', data);
    console.log('index', index);
    console.log('thispeakdersindex', this.speakers[index].name);


    this.afs.doc(`messaging/${this.authService.authState.email}`)
      .update({ data })
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        // console.log('Error updating user', error); // (document does not exists)
        this.afs.doc(`messaging/${this.authService.authState.email}`)
          .set({ data });
      });
  }
}
