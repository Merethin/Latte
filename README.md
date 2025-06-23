# Latte

An all-in-one NationStates userscript for tag raiding.

## DISCLAIMER

While best efforts are being made to comply with NationStates scripting rules, this tool is in active development and should not be assumed to be legal. It should only be used for testing purposes by its developers until this disclaimer is removed.

## Development Status

Status: "pre-alpha", version 0.0.1

Many features are unfinished or straight up not implemented at all. Completely experimental. You should not use this unless you're a developer actively working on the project. Here be dragons.

## Overview (planned features & roadmap)

Latte is an all-in-one keybind script for NationStates tag raiding, inspired by the likes of Feather, Railgun and Reliant.

- Single-tap keybinds for most NationStates site actions relevant to tagging (mostly implemented)
- WA application storage in a "quiver" (not started)
- Latte "plugins" to import WA applications from places like GMail into Latte's quiver (not started)
- Simple keybinds for fast switcher prepping, similar to Reliant (implemented)
- Simple keybinds for fast tagging of hit regions, similar to Henson (not started)

## Keybinds

Latte's keybinds are all configurable by going to https://www.nationstates.net/page=blank/latte=settings.
These are only the defaults, based on Feather keybinds.

- Refresh (default: A) - reload the page (implemented).
- Update Auth (default: J) - update the chk and localid values needed to make requests (implemented). if certain actions aren't working for no reason, you probably need to do this.
- Endorse (default: S) - endorse a nation (implemented).
- Unendorse (default: L) - withdraw endorsement from a nation (implemented).
- Join WA (default: R) - confirm WA application from either the join_WA page (implemented) or Latte's internal WA application storage, aka "quiver" (not implemented), and copy the nation link to clipboard (implemented).
- Move (default: F) - move to the current region (implemented).
- Move to Jump Point (default: B) - move to the jump point (implemented), which can be configured in the Settings page above.
- Apply to WA (default: H) - apply to join the world assembly (implemented).
- Resign from WA (default: E) - resign from the world assembly (implemented).
- Show Current Region (default: Z) - load the current region page (implemented).
- Copy Current Nation (default: X) - copy the current nation link to clipboard (implemented).
- Appoint/Dismiss RO (default: D) - appoint yourself as RO (implemented), rename governor (not implemented), dismiss other ROs (not implemented).
- Prep (default: P) - take you to the prep page if not there (implemented), perform prepping actions (implemented).
- Tag (default: T) - take you to the tag page if not there (implemented), perform tag actions (not implemented).

## Installing from Releases

**Note: As this is a pre-alpha, there are no releases. These instructions are meant for future end users.**
**If you are a developer, refer to the development build instructions. If you aren't, wait until the project is in a more advanced state.**

Go to the Releases page, select the latest release, and download either `latte.user.js` or `latte.min.user.js` (the latter is smaller in size but less readable). As long as you have the Tampermonkey extension installed, it should prompt you to install the script.

After this, you probably want to install one of the following plugins to load WA applications from:

- Currently, none

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