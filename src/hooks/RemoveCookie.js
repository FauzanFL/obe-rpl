import Cookie from 'js-cookie';

const RemoveCookie = (cookiename) => {
  Cookie.remove(cookiename, { domain: `.${import.meta.env.VITE_DOMAIN}` });
};

export default RemoveCookie;
