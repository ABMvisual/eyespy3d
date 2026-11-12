# Eye Spy 3D

A hidden-object game played inside a Matterport tour of an antique store. Players hear a riddle at each of 14 scan points and must find and click every object it describes (53 in all).

## What is in this repository

| File | What it is |
| --- | --- |
| `mashup_es3d.js` | The game. One script, loaded into MPEmbed as custom JavaScript. Riddles, objects and hints are in the CONTENT block at the top. |
| `HINTS.md` | Every riddle and hint in plain text, for proofreading. |
| `backend/leaderboard.gs` | Google Apps Script for the shared leaderboard, Part 2 sign-ups and feedback. Setup steps are at the top of the file. |
| `dev/mock.html` | A stand-in for MPEmbed, for running the game locally without the real tour. |
| `nadirs/` | Draft square riddle images for the floor, one per level, drawn from the original disc template (leather, brass edge, Arial, gold and cream). |
| `icon-512.png` | The ES3D icon, for the browser tab, itch.io and Discord. |
| `*.mp3` | One recorded sound per object. No longer used by the game; kept as source material. |

## How the game is loaded

The public game is `https://mpembed.com/show/?m=xqbmbKAYgu6&mpu=3780`. MPEmbed's saved settings load the script from the `main` branch, so whatever is on `main` is live.

To try a version without touching the live game, add it to the link:

```
https://mpembed.com/show/?m=xqbmbKAYgu6&mpu=3780&customjs=https://cdn.jsdelivr.net/gh/ABMvisual/eyespy3d@<commit id>/mashup_es3d.js
```

## To do

- **Website:** the Eye Spy 3D page on abmvisual.com should be purely about the game and its AVCon Indie Games Room feature. It is original IP shared freely with anyone who wants to play, not a promotion for ABM Visual's services. A separate case study can cover the technology and how it was applied.
- **Backend:** deploy `backend/leaderboard.gs` and put its web app URL in `BACKEND_URL`. Until then the leaderboard is per device and sign-ups are not stored.
- **Hints:** proofread `HINTS.md`. Still open:
  - Level 7: "a third more time" and "a round thing" have no location.
  - Level 6, barley: the location note was unclear; it currently reads "In the same cabinet as hide and seek".
  - Level 12, goanna: the note said "on the floor below the wooden goanna"; what is it below?
  - About a dozen first hints (nudges) are guesses from the riddle wording.
- **Riddle wording:** the floor discs are the master copy, because the recordings follow them. All 14 levels now match their discs word for word, including which words are highlighted. Level 14 uses "spied a tiger", as in the editable disc template.
- **Design:** every visual change is shown as options and chosen before it is built. Current look: charcoal panels, cream text, plain sans-serif. Open choices: which yellow (warm default, `&es3dtheme=k` for the logo's lime, `&es3dtheme=e` for electric), approving the square riddle discs in `nadirs/`, and phone-framed or moving photos.
- **After going live:** remove `standDownLegacyScript` and the `#eye-spy-*` style rule from the script. They only matter while MPEmbed's saved settings still load the old V3031 script alongside a test version.
- **Intro video:** to be replaced (`YOUTUBE_VIDEO_ID`).
- **Phones:** tall popup images are a first attempt and untested on a real phone.
- **Multiplayer:** shared rooms so friends in different places can play together and talk, most likely as a Discord Activity.
