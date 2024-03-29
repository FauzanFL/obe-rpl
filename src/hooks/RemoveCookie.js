import Cookie from 'js-cookie';

const RemoveCookie = (cookiename) => {
  console.log('Removing cookie: ', cookiename);
  Cookie.remove(cookiename, { domain: '.obe-rpl.site' });
};

export default RemoveCookie;
