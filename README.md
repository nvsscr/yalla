# Yalla! — spoken Levantine Arabic

A picture-and-sound phrase app for English speakers who want to speak Levantine Arabic, and, if they like,
read and write it too. Each phrase shows a picture, an easy English-letter spelling, the Arabic writing
(can be hidden in Settings) and the meaning.

Open `yalla.html` (or `index.html`) on any phone or computer. No install, no account; progress stays on the device.

## What's inside
- 9 topics, about 100 phrases: Hello & bye, The basics, About me, Food & drinks, Family & friends,
  How I feel, Out & about, Like a local, Numbers 1–10, plus "Mix it up" with every phrase.
- **Alphabet**: the 28 letters with their names, sounds and the shapes they take at the start,
  middle and end of a word.
- Four ways to practise each topic:
  - **Look**: go through the phrases, tap to hear them.
  - **Listen**: hear a phrase, tap the right picture. After a right answer it waits: replay it, then tap *Next*.
  - **Say it**: see the meaning, say it out loud, tap *Check* to hear it, then mark *Got it* or *Not yet*.
  - **Write it**: hear it, then build the word from letter tiles, right to left (short phrases only).
- It keeps track of what you know (listening, speaking and writing separately): never the same question twice
  in a row, mistakes come back 2 questions later, known phrases come back less and less often.
- Lots of sound effects, confetti and a cat.

## Dialect
Spoken Levantine (Lebanon / Syria / Palestine / Jordan), masculine forms (a man speaking to a man).
The voice is Microsoft's Lebanese neural voice (ar-LB-RamiNeural). It is a computer voice reading
dialect spellings, so a native speaker should double-check a few phrases; fix one by changing its
Arabic text in the `/*DATA*/` block and re-running the audio script.

Spoken Arabic has no official spelling; *Write it* uses the usual everyday way people text it.
A few phrases are spelled differently for the voice than for writing (see `WRITTEN` in the code).

## Files
| Path | What |
|---|---|
| `yalla.html` | the whole app (phrases are in the `/*DATA*/ … /*END*/` block) |
| `audio/clips.json` | every recording, as one file |
| `img/` | Fluent 3D emoji pictures (MIT, Microsoft) |
| `tools/gen_audio.py` | `pip install edge-tts` then `python tools/gen_audio.py yalla.html audio/clips.json` |
| `tools/fetch-images.mjs` | downloads any missing emoji pictures |
