import Cookie from 'js-cookie';

const SetCookie = (cookiename, usrin) => {
  Cookie.set(cookiename, usrin, {
    expires: 1,
    secure: true,
    sameSite: 'Lax',
    path: '/',
  });
};

export default SetCookie;
