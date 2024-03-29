import Cookie from 'js-cookie';

const SetCookie = (cookiename, usrin) => {
  const expires = new Date(Date.now() + 86400000);
  Cookie.set(cookiename, usrin, {
    expires,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    domain: '.obe-rpl.site',
  });
};

export default SetCookie;
