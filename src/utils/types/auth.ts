// типизация данных пользователя
export type TSigninResponse = {
  status: string;
  token: string;
};

export type TUserSignupData = {
  password: string;
  email: string;
  name: string;
};

export type TUserSigninData = Omit<TUserSignupData, 'name'>;

export type TSignupResponse = Omit<TSigninResponse, 'token'>;

export type TSignoutResponse = TSignupResponse;
