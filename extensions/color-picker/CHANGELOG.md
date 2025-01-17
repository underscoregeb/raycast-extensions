# Color Picker Changelog

## [Enhancement] - 2024-06-30

- Add "Color Wheel" command

## [Enhancement] - 2024-06-07

- Fix bug with OKLCH/LCH conversion

## [Enhancement] - 2024-06-07

- Update OKLCH & LCH color formats to use percentage for lightness

## [Enhancement] - 2024-05-31

- Add support for rgb, rgb %, oklch, lch and p3 color formats
- Add "Convert Color" command
- Update "Generate Colors" command to respect the preferred color format

## [Generate Colors using AI] - 2024-05-23

- Add a new "Generate Colors" command
- Group "Copy As..." actions into a single submenu
- Remember the user's choice when deleting a color from the history

## [Cross-Extension] - 2024-05-15

- Expose extension ability with [Raycast Cross-Extension Conventions](https://github.com/LitoMore/raycast-cross-extension-conventions)

## [Enhancement] - 2024-03-08

- Added HEX without prefix (#) color format

## [Fix] - 2024-03-06

- Resolved an issue where the color in the Menu Bar was not displayed correctly.

## [Fixes] - 2024-02-26

- Make sure that colors picked on a P3 display are converted to sRGB when displayed as hex
- Added different actions to copy colors in different formats directly
- Fixed a bug where setting a custom title overwrote other colors

## [Enhancement] - 2024-02-26

- Added support for setting a title

## [New Swift Macro] - 2024-02-16

- Upgrade to the latest version of Swift Macros

## [Enhancements] - 2023-11-30

- Now using Raycast Swift Macro instead of manually compiling

## [Enhancement] - 2023-11-17

- Added HEX color to HUD when picking

## [Maintenance] - 2023-09-15

- Fixed handling of undefined which was introduced with additional settings
- Cleaned up the code

## [Fix] - 2023-02-17

- Fixed an error when picking a color when the menubar command is disabled

## [Initial Version] - 2023-02-08
