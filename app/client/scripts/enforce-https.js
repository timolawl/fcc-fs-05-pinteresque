export default () => {
    const host = 'timolawl-imgesque.herokuapp.com';
    if ((host == location.host) && (location.protocol != 'https:'))
        location.protocol = 'https';
}
