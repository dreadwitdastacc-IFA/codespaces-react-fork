Apply these changes in your local clone:
1. Download branch-artifact.tar.gz and extract
2. From your repo root: git checkout -b feat/testcontainers-cloud-check
3. cp -r branch-artifact/.github .
4. cp branch-artifact/package.json .
5. cp branch-artifact/inner_example_changes.patch .
6. git apply inner_example_changes.patch || true
7. git add -A && git commit -m 'Make Testcontainers cloud assertion opt-in via env var; add PR trigger workflow'
