#!/usr/bin/env bash
#
# End-to-end check that sitelo's optional peer dependencies work under one
# package manager.
#
#   ./test-package-manager.sh npm|pnpm|yarn|yarn-berry
#
# sharp and pagefind are declared as OPTIONAL PEER dependencies. That
# declaration is load-bearing and fails in an asymmetric way: if it were
# ever changed to a plain dependency, or dropped so the imports relied on
# a hoisted copy, npm and pnpm would keep working and only Yarn Berry's
# Plug'n'Play linker — which lets a package resolve only what it declares
# — would break. This runs the real thing under each manager so that
# cannot regress silently.
#
# For each manager:
#   1. install sitelo alone      -> sharp/pagefind absent, plain build works
#   2. enable images             -> actionable error naming that manager
#   3. install sharp + pagefind  -> real .webp variant and a real index
set -euo pipefail

MANAGER="${1:?usage: test-package-manager.sh npm|pnpm|yarn|yarn-berry}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

fail() { echo "::error::[$MANAGER] $*"; exit 1; }
info() { echo "  [$MANAGER] $*"; }

# Run a command, capturing output. On failure, print what it said before
# giving up -- a swallowed failure under `set -e` exits silently and
# leaves nothing to diagnose.
run_logged() {
  local label="$1" dir="$2"; shift 2
  local log="$WORK/$(echo "$label" | tr ' /' '__').log"

  if ! ( cd "$dir" && "$@" ) >"$log" 2>&1; then
    echo "::group::[$MANAGER] $label failed"
    echo "\$ $*"
    cat "$log"
    echo "::endgroup::"
    fail "$label failed (see log above)"
  fi
}

# --- pack -----------------------------------------------------------------
#
# Pack from a copy carrying a throwaway version. Yarn Classic caches by
# package name + version, so re-packing at an unchanged version makes it
# silently reinstall a previously cached tarball.
# --- preflight -------------------------------------------------------------
case "$MANAGER" in
  npm)        MANAGER_BIN=(npm) ;;
  pnpm)       MANAGER_BIN=(pnpm) ;;
  yarn)       MANAGER_BIN=(yarn) ;;
  yarn-berry) MANAGER_BIN=(corepack yarn) ;;
  *)          fail "unknown package manager: $MANAGER" ;;
esac

command -v "${MANAGER_BIN[0]}" >/dev/null 2>&1 \
  || fail "${MANAGER_BIN[0]} is not on PATH"

if [ "$MANAGER" = "yarn-berry" ]; then
  info "ambient yarn $(yarn --version 2>&1 | tail -1); Berry is set per-project below"
else
  info "using $("${MANAGER_BIN[@]}" --version 2>&1 | tail -1)"
fi
info "node $(node --version)"

PACK_SRC="$WORK/pack-src"
mkdir -p "$PACK_SRC"
git -C "$REPO_ROOT" ls-files -z | while IFS= read -r -d '' f; do
  mkdir -p "$PACK_SRC/$(dirname "$f")"
  cp "$REPO_ROOT/$f" "$PACK_SRC/$f"
done

TEST_VERSION="0.0.0-pmtest"
node -e "
  const fs = require('fs');
  const p = JSON.parse(fs.readFileSync('$PACK_SRC/package.json', 'utf8'));
  p.version = '$TEST_VERSION';
  fs.writeFileSync('$PACK_SRC/package.json', JSON.stringify(p, null, 2) + '\n');
"
( cd "$PACK_SRC" && npm pack --pack-destination "$WORK" >/dev/null 2>&1 )
TARBALL="$WORK/sitelo-$TEST_VERSION.tgz"
[ -f "$TARBALL" ] || fail "npm pack produced no tarball"

# --- fixture --------------------------------------------------------------
make_project() {
  local dir="$1" config="$2"
  rm -rf "$dir"; mkdir -p "$dir/src/images"
  printf '%s\n' "$config" > "$dir/sitelo.config.js"
  cat > "$dir/package.json" <<'JSON'
{ "name": "pm-test", "private": true, "type": "module", "version": "1.0.0" }
JSON
  cat > "$dir/src/index.ht.js" <<'JS'
export default () => `<html lang="en"><head><title>t</title></head>
<body data-pagefind-body><h1>hello</h1><img src="/images/a.png" alt="a"></body></html>`
JS
  node -e "
    const b = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    require('fs').writeFileSync('$dir/src/images/a.png', b);
  "
}

# --- per-manager plumbing -------------------------------------------------
setup_manager() {
  local dir="$1"
  case "$MANAGER" in
    yarn-berry)
      run_logged "yarn set version stable" "$dir" corepack yarn set version stable

      local version linker
      version="$( cd "$dir" && corepack yarn --version 2>&1 | tail -1 )"
      case "$version" in
        1.*|"") fail "expected Yarn Berry, got '$version' -- this leg must not silently fall back to Classic" ;;
      esac

      linker="$( cd "$dir" && corepack yarn config get nodeLinker 2>&1 | tail -1 )"
      [ "$linker" = "pnp" ] \
        || fail "expected the Plug'n'Play linker, got '$linker' -- strict resolution is the whole point of this leg"

      info "yarn $version, nodeLinker=$linker"
      ;;
  esac
}

add_deps() {
  local dir="$1"; shift
  case "$MANAGER" in
    npm)        run_logged "install" "$dir" npm install "$@" --no-audit --no-fund ;;
    pnpm)       run_logged "install" "$dir" pnpm add "$@" ;;
    yarn)       run_logged "install" "$dir" yarn add "$@" ;;
    yarn-berry) run_logged "install" "$dir" corepack yarn add "$@" ;;
  esac
}

run_build() {
  local dir="$1"
  case "$MANAGER" in
    npm|pnpm|yarn) ( cd "$dir" && ./node_modules/.bin/sitelo build 2>&1 ) ;;
    yarn-berry)    ( cd "$dir" && corepack yarn sitelo build 2>&1 ) ;;
  esac
}

# Yarn Berry uses Plug'n'Play: there is no node_modules at all, so absence
# has to be checked through the resolver rather than the filesystem.
# `yarn why` is no good for this -- it exits 0 with empty output for a
# package that is not installed.
assert_peers_absent() {
  local dir="$1"
  local probe="try { await import(process.argv[1]); console.log('RESOLVED') } catch { console.log('ABSENT') }"

  case "$MANAGER" in
    yarn-berry)
      for pkg in sharp pagefind; do
        if ( cd "$dir" && corepack yarn node --input-type=module -e "$probe" "$pkg" 2>/dev/null ) \
             | grep -q RESOLVED; then
          fail "$pkg resolvable without being asked for"
        fi
      done
      ;;
    *)
      for pkg in sharp pagefind; do
        [ -d "$dir/node_modules/$pkg" ] && fail "$pkg installed without being asked for"
      done
      ;;
  esac
  info "sharp and pagefind correctly absent"
}

# --- 1. sitelo alone ------------------------------------------------------
BARE="$WORK/bare"
make_project "$BARE" "export default { buildReport: false }"
setup_manager "$BARE"
add_deps "$BARE" "$TARBALL"
assert_peers_absent "$BARE"

run_build "$BARE" >"$WORK/bare.log" 2>&1 \
  || { cat "$WORK/bare.log"; fail "plain build failed"; }
[ -f "$BARE/dist/index.html" ] || fail "plain build emitted no index.html"
info "plain build works"

# --- 2. images on, sharp missing -> actionable, manager-specific error -----
node -e "require('fs').writeFileSync('$BARE/sitelo.config.js','export default { buildReport: false, images: true }')"

if run_build "$BARE" >"$WORK/err.log" 2>&1; then
  cat "$WORK/err.log"; fail "build should fail when images are on and sharp is missing"
fi

grep -q "requires sharp" "$WORK/err.log" \
  || { cat "$WORK/err.log"; fail "missing-sharp error was not actionable"; }

case "$MANAGER" in
  npm)               EXPECT="npm install -D sharp" ;;
  pnpm)              EXPECT="pnpm add -D sharp" ;;
  yarn|yarn-berry)   EXPECT="yarn add -D sharp" ;;
esac

grep -qF "$EXPECT" "$WORK/err.log" \
  || { cat "$WORK/err.log"; fail "expected the error to suggest: $EXPECT"; }
info "missing-sharp error suggests: $EXPECT"

# No message may carry a doubled log prefix.
if grep -qF "[sitelo] [sitelo]" "$WORK/err.log"; then
  cat "$WORK/err.log"; fail "doubled [sitelo] prefix in error output"
fi

# --- 3. with the peers installed, the features really work ----------------
FULL="$WORK/full"
make_project "$FULL" "export default { buildReport: false, images: { widths: [400], formats: ['webp'] }, pagefind: true }"
setup_manager "$FULL"
add_deps "$FULL" "$TARBALL" sharp pagefind

run_build "$FULL" >"$WORK/full.log" 2>&1 \
  || { cat "$WORK/full.log"; fail "build with sharp and pagefind failed"; }

# Assert real output, not just a zero exit code.
find "$FULL/dist" -name '*.webp' | grep -q . \
  || { cat "$WORK/full.log"; fail "sharp produced no .webp variant"; }
info "sharp produced a .webp variant"

[ -f "$FULL/dist/pagefind/pagefind-entry.json" ] \
  || { cat "$FULL/full.log" 2>/dev/null; fail "pagefind wrote no index"; }
info "pagefind wrote an index"

echo "  [$MANAGER] OK"
