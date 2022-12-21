import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ROLE } from 'src/app/shared/constants/role.constant';

export interface IRegister {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmationPassword?: string
}

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public loginForm!: FormGroup;
  public registerForm!: FormGroup;
  public isLogin = true;
  public checkPassword = false;
  private registerData!: IRegister;

  constructor(
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmedPassword: [null, [Validators.required]],
    })
  }

  loginUser(): void {
    const {email, password} = this.loginForm.value;
    this.login(email, password).then(() => {
      this.toastr.success('User successfully login');
    }).catch(e => {
      this.toastr.error(e.message);
    })
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      const currentUser = {...user, uid: credential.user.uid};
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (user && user['role'] === ROLE.USER) {
        this.router.navigate(['/cabinet']);
        this.accountService.isUserLogin$.next(true);
        this.dialogRef.close();
      }
    }, (e) => {
      console.log('error', e);
    })
  }

  registerUser(): void {
    const {email, password} = this.registerForm.value;
    this.registerData = this.registerForm.value;
    this.emailSignUp(email, password).then(() => {
      this.toastr.success('User successfully created');
      this.isLogin = !this.isLogin;
      this.registerForm.reset();
    }).catch(e => {
      this.toastr.error(e.message);
    })
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      phoneNumber: '',
      address: '',
      orders: [],
      role: 'USER'
    };
    await setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

  checkConfirmedPassword(): void {
    this.checkPassword = this.password.value === this.confirmed.value;
    if (this.password.value !== this.confirmed.value) {
      this.registerForm.controls['confirmedPassword'].setErrors({
        matchError: `Password confirmation doesn't match`
      })
    }
  }

  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }

  get confirmed(): AbstractControl {
    return this.registerForm.controls['confirmedPassword'];
  }

  checkVisibilityError(control: string, name: string): boolean | null {
    return this.registerForm.controls[control].errors?.[name]
  }
}
