import json
import os
import sqlite3
import sys

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


def main() -> int:
    if not os.path.exists(DB):
        print(f"DB not found: {DB}", file=sys.stderr)
        return 1

    conn = sqlite3.connect(DB, timeout=30)
    cur = conn.cursor()

    row = cur.execute("SELECT value FROM ItemTable WHERE key=?", (APP_KEY,)).fetchone()
    if not row:
        print("applicationUser blob missing", file=sys.stderr)
        conn.close()
        return 1

    data = json.loads(row[0])
    before = {
        "openAIBaseUrl": data.get("openAIBaseUrl"),
        "useOpenAIKey": data.get("useOpenAIKey"),
        "userAddedModels": (data.get("aiSettings") or {}).get("userAddedModels"),
    }
    print("BEFORE:", json.dumps(before, indent=2))

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

    # Prefer auto/best-coding on available modes if modelConfig exists
    model_config = ai.get("modelConfig")
    if isinstance(model_config, dict):
        for mode, cfg in model_config.items():
            if isinstance(cfg, dict):
                cfg["modelName"] = "auto/best-coding"
                selected = cfg.get("selectedModels")
                if isinstance(selected, list) and "auto/best-coding" not in selected:
                    selected.append("auto/best-coding")

    payload = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
    cur.execute(
        "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
        (APP_KEY, payload),
    )

    # Plaintext fallback key (older Cursor / some builds)
    cur.execute(
        "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
        ("cursorAuth/openAIKey", API_KEY),
    )
    # Also write secret:// cell as plaintext string — works when Cursor
    # still accepts unencrypted values; encrypted electron safeStorage
    # would require Cursor process APIs we don't have here.
    cur.execute(
        "INSERT OR REPLACE INTO ItemTable(key, value) VALUES(?, ?)",
        ("secret://cursorAuth/openAIKey", API_KEY),
    )

    conn.commit()

    row2 = cur.execute("SELECT value FROM ItemTable WHERE key=?", (APP_KEY,)).fetchone()
    data2 = json.loads(row2[0])
    after = {
        "openAIBaseUrl": data2.get("openAIBaseUrl"),
        "useOpenAIKey": data2.get("useOpenAIKey"),
        "userAddedModels": (data2.get("aiSettings") or {}).get("userAddedModels"),
    }
    print("AFTER:", json.dumps(after, indent=2))

    for k in ("cursorAuth/openAIKey", "secret://cursorAuth/openAIKey"):
        r = cur.execute(
            "SELECT length(value), substr(CAST(value AS TEXT),1,12) FROM ItemTable WHERE key=?",
            (k,),
        ).fetchone()
        print(f"{k}: len={r[0]} prefix={r[1]!r}")

    conn.close()
    print("OK: OmniRoute configured in Cursor state.vscdb")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
