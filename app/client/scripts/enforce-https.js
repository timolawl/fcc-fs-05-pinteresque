export default () => {
    const host = 'timolawl-imgbrick.herokuapp.com';
    if ((host == location.host) && (location.protocol != 'https:'))
        location.protocol = 'https';
}
