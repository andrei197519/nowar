#!/usr/bin/env python3
import json
import os
import re
import subprocess


def find_photo_dir(base_dir):
    entries = {entry.lower(): entry for entry in os.listdir(base_dir)}
    for name in ("photo", "Photo"):
        entry = entries.get(name.lower(), name)
        path = os.path.join(base_dir, entry)
        if os.path.isdir(path):
            return entry, path
    return "Photo", os.path.join(base_dir, "Photo")


def mdls_value(path, key):
    result = subprocess.run(
        ["mdls", "-raw", "-name", key, path],
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
        text=True,
    )
    value = result.stdout.strip()
    if value in ("", "(null)", "0"):
        return ""
    matches = re.findall(r'"([^"]+)"', value)
    if matches:
        return " ".join(m.strip() for m in matches if m.strip())
    return value


def extract_comment(path):
    for key in ("kMDItemFinderComment", "kMDItemComment"):
        value = mdls_value(path, key)
        if value:
            return value
    return mdls_value(path, "kMDItemAuthors")


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    web_dir, fs_dir = find_photo_dir(base_dir)
    photos = []

    if os.path.isdir(fs_dir):
        for name in sorted(os.listdir(fs_dir), key=str.lower):
            path = os.path.join(fs_dir, name)
            if not os.path.isfile(path):
                continue
            ext = os.path.splitext(name)[1].lower()
            if ext not in (".jpg", ".jpeg", ".png"):
                continue
            photos.append({"file": name, "comment": extract_comment(path)})

    payload = {"dir": web_dir, "photos": photos}
    out_path = os.path.join(base_dir, "photos.json")
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


if __name__ == "__main__":
    main()
