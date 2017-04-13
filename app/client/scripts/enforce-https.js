export default () => {
    const host = 'timolawl-pinteresque.herokuapp.com';
    if ((host == location.host) && (location.protocol != 'https:'))
        location.protocol = 'https';
}
