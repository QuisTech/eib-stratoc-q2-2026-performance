# Hybrid Sync Troubleshooting Guide

This document records the incredibly stubborn issues encountered when building an automated "Sync and Deploy" button directly inside a running Next.js application managed by PM2 on a VPS, and exactly how they were solved. 

**Keep this file as a reference. If you ever rewrite or refactor the sync API route (`app/api/admin/sync/route.ts`), you MUST abide by these fixes.**

---

## 1. Git Add Fails due to `.gitignore`
**Error:** \`Command failed: git add ... hint: The following paths are ignored by one of your .gitignore files: .next\`
**Cause:** When programmatically running \`git add\` on specific folders (like \`public/uploads\`), certain Git versions on the VPS throw a fatal error if the current repository state conflicts with ignored hidden folders like \`.next\`.
**Solution:** Do not use \`git add\` explicitly for tracked files. Instead, use \`git commit -am "chore: hybrid sync"\`. The \`-a\` flag automatically stages all modified tracked files while safely bypassing \`.gitignore\` conflicts.

## 2. Git Commit Crashes on Empty Changes
**Error:** \`Command failed: git commit -am ... nothing to commit, working tree clean\`
**Cause:** If the user hasn't made any edits, or if they manually ran \`git pull\` right before clicking the Sync button, there will be zero changes. \`git commit\` exits with status code 1 when there's nothing to commit, which causes Node's \`execAsync\` to throw a fatal exception and halt the sync.
**Solution:** Wrap the \`git commit\` command in a \`try/catch\` block. If it fails, log "No new changes detected to commit. Continuing..." and proceed. Never throw the error.

## 3. Git Push Fails (Authentication/Credentials)
**Error:** \`fatal: could not read Username for 'https://github.com': No such device or address\`
**Cause:** When you SSH into your VPS manually, your session has cached GitHub credentials. However, the PM2 background process runs completely disconnected from your SSH session. It has no way to prompt you for a password, so GitHub rejects the push.
**Solution:** 
1. Wrap \`git push\` in a \`try/catch\` so that if Vercel deployment is skipped, the local VPS build STILL continues successfully.
2. Provide PM2 with a GitHub Personal Access Token (PAT) by embedding it directly into the git remote URL on the VPS:
   \`git remote set-url origin https://[USERNAME]:[TOKEN]@github.com/QuisTech/eib-stratoc-q2-2026-performance.git\`

## 4. Next.js Build Crash: \`generate is not a function\`
**Error:** \`TypeError: generate is not a function at ignore-listed frames\`
**Cause:** When PM2 runs Next.js, it injects internal environment variables into the process (e.g., \`__NEXT_PRIVATE_PREBUNDLED_REACT\`, \`NEXT_PHASE\`). When the API route spawns a child process to run \`next build\`, that child process **inherits** these server variables. The compiler gets deeply confused, thinks it's running as a server instead of a builder, and crashes.
**Solution:** When spawning the \`execAsync\` child process for the build, you MUST pass a meticulously scrubbed \`env\` object that deletes any key starting with \`__NEXT_\` or \`NEXT_PHASE\`.

## 5. Next.js Build Crash: \`Couldn't find any 'app' or 'pages' directory\`
**Error:** \`Error: Couldn't find any app or pages directory. Please create one under the project root\`
**Cause:** The VPS uses PM2 to run the Next.js **standalone bundle** (which is best practice for Node deployments). However, this means PM2 starts the server from inside the hidden \`.next/standalone\` folder.
When the API route asks for \`process.cwd()\`, Node returns \`/path/to/project/.next/standalone\`.
If you try to run \`npx next build\` or write files to \`process.cwd()\`, it attempts to do it inside the standalone folder, which doesn't contain your \`app\` folder or your \`node_modules/next/dist\` binaries!
**Solution:**
1. Dynamically resolve the TRUE project root by checking if \`process.cwd()\` includes the word \`standalone\`. If it does, traverse two folders up (\`../..\`) to get the real root.
2. Pass this \`realCwd\` as the explicit \`cwd\` option to EVERY single \`execAsync\` command (git, build, pm2 restart).
3. Do not use \`pnpm\` or \`npx\` wrappers, as they have their own environment pathing quirks. Explicitly execute the Next.js binary using Node: \`node node_modules/next/dist/bin/next build "\${realCwd}"\`.
