import { Action } from '@ngrx/store';
import { AccountLogin } from '../../../core/services/account-login/account-login.model';
import { Customer } from '../../../models/customer/customer.model';

export const LOGIN_USER = '[Account] Login User';
export const LOGIN_USER_SUCCESS = '[Account] Login User Success';
export const LOGIN_USER_FAIL = '[Account] Login User Failed';

export class LoginUser implements Action {
  readonly type = LOGIN_USER;
  constructor(public payload: AccountLogin) { }
}

export class LoginUserFail implements Action {
  readonly type = LOGIN_USER_FAIL;
  constructor(public payload: any) { }
}

export class LoginUserSuccess implements Action {
  readonly type = LOGIN_USER_SUCCESS;
  constructor(public payload: Customer) { }
}

export type LoginUserAction = LoginUser | LoginUserFail | LoginUserSuccess;
