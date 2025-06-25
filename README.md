# Latte

An all-in-one NationStates userscript for tag raiding.

## DISCLAIMER

While best efforts are being made to comply with NationStates scripting rules, this tool is in active development and should not be assumed to be legal. It should only be used for testing purposes by its developers until this disclaimer is removed.

## Development Status

Status: "beta", version 0.2.0

All initially planned features have been implemented, but have not been really tested and/or reviewed. Should preferably only be used by developers and/or testers.

## Overview

Latte is an all-in-one keybind script for NationStates tag raiding, inspired by the likes of Feather, Railgun and Reliant.

- Single-tap keybinds for most NationStates site actions relevant to tagging
- WA application storage in a "quiver"
- Latte "plugins" to import WA applications from places like GMail into Latte's quiver
- Simple keybinds for fast switcher prepping, similar to Reliant
- Simple keybinds for fast tagging of hit regions, similar to Henson

## Keybinds

Latte's keybinds are all configurable by going to https://www.nationstates.net/page=blank/latte=settings.
These are only the defaults, based on Feather keybinds.

- Refresh (default: A) - reload the page.
- Update Auth (default: J) - update the chk and localid values needed to make requests. if certain actions aren't working for no reason, you probably need to do this.
- Endorse (default: S) - endorse a nation.
- Unendorse (default: L) - withdraw endorsement from a nation.
- Join WA (default: R) - confirm WA application from either the join_WA page or Latte's internal WA application storage, aka "quiver", and copy the nation link to clipboard.
- Move (default: F) - move to the current region.
- Move to Jump Point (default: B) - move to the jump point, which can be configured in the Settings page above.
- Apply to WA (default: H) - apply to join the world assembly.
- Resign from WA (default: E) - resign from the world assembly.
- Show Current Region (default: Z) - load the current region page.
- Copy Current Nation (default: X) - copy the current nation link to clipboard.
- Appoint RO (default: D) - appoint yourself as RO.
- Prep (default: P) - load the prep page if not there, otherwise perform prepping actions (one per keypress).
- Tag (default: T) - load the tag page if not there, otherwise perform tag actions (one per keypress).

## Known Issues

Unicode characters in WFEs _will_ break, despite NationStates itself supporting them. So no flags, emojis, overly special characters, etc. BBcode itself works completely fine.

## Installing from Releases

Go to the Releases page, select the latest release, and download either `latte.user.js` or `latte.min.user.js` (the latter is smaller in size but less readable). As long as you have the Tampermonkey extension installed, it should prompt you to install the script.

After this, you probably want to install one of the following plugins to load WA applications from:

- LatteNS (loads applications from WA join pages - `page=join_WA`)
- LatteGmail (loads applications from Gmail emails)

These plugins can also be found in the releases page, next to the main script.
  
In the Tampermonkey menu, sort by order (by clicking the hashtag) and make sure all plugins are loaded after the main Latte script. As long as you installed Latte first and the plugins afterwards, this should be the case.

## Development Builds

Make sure the submodules are initialized and downloaded:
```
git submodule init
git submodule update
```

Build the userscript:
```
npm install
npm run build
```

This will output two files, the regular `latte.user.js` and the minified `latte.min.user.js`. These are interchangeable. The minified one is smaller but way less readable/debuggable.

## Dependencies

Latte depends on `mousetrap`, installed from NPM, and most of the script's heavy-lifting is done by the  [nsdotjs](https://github.com/audreyreal/nsdotjs) library (thank you, audrey!), which is loaded as a submodule, and automatically handles simultaneity and user agent stuff.

Note that as I'm currently adding new features to nsdotjs to support Latte's demands, the submodule here points to a branch of my fork of nsdotjs. It will updated to point to audrey's branch once changes are merged and things get more stable.

## Contact

Preferably, shoot me a DM at @iris.dreamer on Discord for any questions about Latte. Alternatively, you can telegram Merethin on NationStates.

## Licensing

Latte is free and open-source software under the [BSD-2-Clause](LICENSE) license. Open-source is love <3