# usage: python tools/gen_audio.py yalla.html audio/clips.json [--all]
# Records every phrase of the /*DATA*/ block (the Arabic text, item[0]) with one Lebanese voice,
# plus the few words the app says by itself. Output: one JSON {arabic: "data:audio/mpeg;base64,..."}.
# Clips that already exist are kept unless --all is given (use it after changing the voice).
import asyncio, base64, json, sys, os
import edge_tts

page, out = sys.argv[1], sys.argv[2]
redo = "--all" in sys.argv
html = open(page, encoding="utf-8").read()
cats = json.loads(html.split("/*DATA*/")[1].split("/*END*/")[0])
VOICE = ("ar-LB-RamiNeural", "-8%", "+0Hz")   # Levantine male; slightly slow for learners
EXTRA = ["مَبْروك"]                           # said on the win screen

jobs = [it[0] for c in cats for it in c["items"]] + EXTRA
old = {} if redo or not os.path.exists(out) else json.load(open(out, encoding="utf-8"))
sem = asyncio.Semaphore(8)

async def synth(text):
    name, rate, pitch = VOICE
    async with sem:
        for attempt, nm in enumerate([name, name, "ar-SY-LaithNeural"]):
            try:
                buf = b""
                async for ch in edge_tts.Communicate(text, nm, rate=rate, pitch=pitch).stream():
                    if ch["type"] == "audio": buf += ch["data"]
                if buf: return buf
            except Exception:
                pass
            await asyncio.sleep(1 + attempt)
        raise RuntimeError("failed: " + text)

async def main():
    todo = [k for k in dict.fromkeys(jobs) if k not in old]
    res = await asyncio.gather(*(synth(k) for k in todo))
    clips = {k: old[k] for k in dict.fromkeys(jobs) if k in old}
    for k, b in zip(todo, res):
        clips[k] = "data:audio/mpeg;base64," + base64.b64encode(b).decode()
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    s = json.dumps(clips, ensure_ascii=False)
    open(out, "w", encoding="utf-8").write(s)
    print("clips", len(clips), "new", len(todo), round(len(s) / 1e6, 2), "MB")
asyncio.run(main())
