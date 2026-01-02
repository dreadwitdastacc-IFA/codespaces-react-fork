#!/usr/bin/env python3
import hashlib
import os
import sys
import subprocess

skip = {".git","node_modules",".vscode","patches"}
root = os.getcwd()
hashes = {}
dupes = []

for dirpath, dirs, files in os.walk(root):
    parts = set(dirpath.split(os.sep))
    if parts & skip:
        continue
    for f in files:
        path = os.path.join(dirpath, f)
        try:
            with open(path, 'rb') as fh:
                h = hashlib.sha256(fh.read()).hexdigest()
        except Exception:
            continue
        if h in hashes:
            dupes.append((path, hashes[h]))
        else:
            hashes[h] = path

if not dupes:
    print('No duplicate files found.')
    sys.exit(0)

print('Found duplicates (duplicate -> kept):')
for d, k in dupes:
    print(f"{d}  ->  {k}")

removed = 0
for d, k in dupes:
    try:
        os.remove(d)
        print(f'Removed: {d}')
        removed += 1
    except Exception as e:
        print(f'Failed to remove {d}: {e}')

if removed > 0:
    subprocess.run(['git', 'add', '-A'])
    subprocess.run(['git', 'commit', '-m', 'chore: remove duplicate files (automated)'], check=False)
    print(f'Removed and committed {removed} duplicate files')
else:
    print('No files removed')
