# cornng-frontend

Configurable static frontend for [Ultraviolet](https://github.com/titaniumnetwork-dev/ultraviolet).

Works with Wisp and Bare and can be hosted on any static hosting site (including those that host without root path, such as GitHub sites)

Tested on Chrome, Edge, and Firefox. Resilient against Lightspeed Filter and GoGuardian. Recommended access method is through https://sites.google.com/view/cornunblocked.

## bugs

There is a known bug on firefox where hard reloading the page causes the service worker to expire. I believe this is a firefox bug as Chromium does not have this issue. Reloading the page once normally (through the browser or the navbar) will fix it.

## forking/improving

Edit `src/corn.ts` to add or remove splash text and proxy backends. Remember that the site is licensed under the GNU AGPL V3.0 (as is Ultraviolet) and any edits must be published as open-source before deployment.