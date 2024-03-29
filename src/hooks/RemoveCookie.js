import Cookie from 'js-cookie';

const RemoveCookie = (cookiename) => {
  console.log('Removing cookie: ', cookiename);
  Cookie.remove(cookiename);
};

export default RemoveCookie;
