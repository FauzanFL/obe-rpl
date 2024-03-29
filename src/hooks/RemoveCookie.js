import Cookie from 'js-cookie';

const RemoveCookie = (cookiename) => {
  Cookie.remove(cookiename, { domain: '.obe-rpl.site' });
};

export default RemoveCookie;
