import { AngularFireAuth } from '@angular/fire/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { USER_TEMPLATE } from '../@core/utils/user-template';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { }

  form = this.fb.group({
    name: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]]
  });
  error: string;
  showPassword = false;

  ngOnInit() { }

  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  private async createUser({email, password, name}) {
    const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);

    const document = USER_TEMPLATE;
    document.email = email;
    document.name = name;
    document.uid = user.uid;
    document.id = user.uid;
    document.path = `users/${user.uid}`;
    //TODO ERROR

    await this.afs.doc(document.path).set(document);

    return user;
  }

  async submit({email, password, name}) {
    const loading = await this.loadingCtrl.create();
    loading.present();

    try {
      await this.createUser({email, password, name});
      this.modalCtrl.dismiss();

    } catch (error) {
      switch (error.code) {
        case 'auth/weak-password': this.error = 'Please enter a stronger password.';
          break;
        case 'auth/email-already-in-use': this.error = 'This email address is already linked with an account!'
          break;
        case 'auth/invalid-email': this.error = 'Login attempt failed: Invalid email address';
          break;
        default: this.error = `An error has occurred.
        The cause could be rebellious monkeys.
        Try:
        <ul>
        <li>trying again</li>
        <li>refreshing the page</li>
        <li>resetting your password</li>
        <li>contacting support at: contact@thetodoapp.com</li>
        </ul>`;
        console.error(error);
      }
    }

    loading.dismiss();
  }


}
