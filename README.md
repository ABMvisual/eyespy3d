# Eye Spy 3D

A hidden-object game played inside a Matterport tour of an antique store. Players hear a riddle at each of 14 scan points and must find and click every object it describes (53 in all).

## What is in this repository

| File | What it is |
| --- | --- |
| `mashup_es3d.js` | The game. One script, loaded into MPEmbed as custom JavaScript. Riddles, objects and hints are in the CONTENT block at the top. |
| `HINTS.md` | Every riddle and hint in plain text, for proofreading. |
| `backend/leaderboard.gs` | Google Apps Script for the shared leaderboard, Part 2 sign-ups and feedback. Setup steps are at the top of the file. |
| `dev/mock.html` | A stand-in for MPEmbed, for running the game locally without the real tour. |
| `nadirs/` | Draft square riddle images for the floor, one per level. |
| `*.mp3` | One sound per object. Currently switched off (`ITEM_SOUNDS` in the script). |

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
- **Riddle wording:** the floor discs are the master copy, because the recordings follow them. Levels 1 and 14 now match their discs word for word. Levels 2 to 13 still use a typed version and need checking against the disc images.
- **Design:** every visual change is shown as options and chosen before it is built. Current look: charcoal panels, cream text, yellow accents, plain sans-serif. Open choices: warm or electric yellow, square riddle discs for the floor (drafts in `nadirs/`), and phone-framed or moving photos.
- **Intro video:** to be replaced (`YOUTUBE_VIDEO_ID`).
- **Phones:** tall popup images are a first attempt and untested on a real phone.
- **Multiplayer:** shared rooms so friends in different places can play together and talk, most likely as a Discord Activity.
