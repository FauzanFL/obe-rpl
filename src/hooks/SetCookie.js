import Cookie from 'js-cookie';

const SetCookie = (cookiename, usrin) => {
  const expires = new Date(Date.now() + 86400000);
  Cookie.set(cookiename, usrin, {
    expires,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    domain: `.${import.meta.env.VITE_DOMAIN}`,
  });
};

export default SetCookie;
