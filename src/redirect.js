// this website should only ever be accessed through the sites opener (or another iframe)
const SITES_URL = "https://sites.google.com/view/cornunblocked/home";

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

if (!inIframe())
{
    window.location.replace(SITES_URL);
}
