"""Keep Cursor OmniRoute settings applied while Cursor is running.

Cursor's in-memory reactive storage can overwrite state.vscdb. This loop
re-applies base URL + API key + models until the values stick (e.g. after
a window reload) or until max_seconds elapses.
"""
from __future__ import annotations

import json
import os
import sqlite3
import time

DB = os.path.expandvars(r"%APPDATA%\Cursor\User\globalStorage\state.vscdb")
APP_KEY = (
    "src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl"
    ".persistentStorage.applicationUser"
)
API_KEY = os.environ.get("OMNIROUTE_API_KEY") or ""
if not API_KEY:
    env_path = os.path.join(os.path.expanduser("~"), ".omniroute", ".env")
    if os.path.exists(env_path):
        for line in open(env_path, encoding="utf-8"):
            if line.startswith("OMNIROUTE_API_KEY="):
                API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
                break
if not API_KEY:
    raise SystemExit("OMNIROUTE_API_KEY not set")
BASE_URL = "http://localhost:20128/v1"
MODELS = [
    "auto",
    "auto/best-coding",
    "auto/best-reasoning",
    "auto/best-fast",
    "auto/best-chat",
]


def desired(data: dict) -> bool:
    ai = data.get("aiSettings") or {}
    models = ai.get("userAddedModels") or []
    return (
        data.get("openAIBaseUrl") == BASE_URL
        and data.get("useOpenAIKey") is True
        and all(m in models for m in MODELS)
    )


def apply_once() -> str:
    if not os.path.exists(DB):
        return "missing-db"
    conn = sqlite3.connect(DB, timeout=10)
    try:
        cur = conn.cursor()
        row = cur.execute("SELECT value FROM ItemTable WHERE key=?", (APP_KEY,)).fetchone()
        if not row:
            return "no-blob"
        data = json.loads(row[0])
        if desired(data):
            # still ensure key cells
            cur.execute(
                "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
                ("cursorAuth/openAIKey", API_KEY),
            )
            cur.execute(
                "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
                ("secret://cursorAuth/openAIKey", API_KEY),
            )
            conn.commit()
            return "ok"
        data["openAIBaseUrl"] = BASE_URL
        data["useOpenAIKey"] = True
        ai = data.setdefault("aiSettings", {})
        existing = list(ai.get("userAddedModels") or [])
        for m in MODELS:
            if m not in existing:
                existing.append(m)
        ai["userAddedModels"] = existing
        enabled = list(ai.get("modelOverrideEnabled") or [])
        for m in MODELS:
            if m not in enabled:
                enabled.append(m)
        ai["modelOverrideEnabled"] = enabled
        model_config = ai.get("modelConfig")
        if isinstance(model_config, dict):
            for _mode, cfg in model_config.items():
                if isinstance(cfg, dict):
                    cfg["modelName"] = "auto/best-coding"
        payload = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
        cur.execute(
            "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
            (APP_KEY, payload),
        )
        cur.execute(
            "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
            ("cursorAuth/openAIKey", API_KEY),
        )
        cur.execute(
            "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
            ("secret://cursorAuth/openAIKey", API_KEY),
        )
        conn.commit()
        return "patched"
    finally:
        conn.close()


def main() -> None:
    max_seconds = 180
    interval = 1.5
    start = time.time()
    ok_streak = 0
    while time.time() - start < max_seconds:
        status = apply_once()
        print(f"{time.strftime('%H:%M:%S')} {status}", flush=True)
        if status == "ok":
            ok_streak += 1
            if ok_streak >= 8:
                print("STUCK: settings held for ~12s — done", flush=True)
                return
        else:
            ok_streak = 0
        time.sleep(interval)
    print("DONE: timeout", flush=True)


if __name__ == "__main__":
    main()
