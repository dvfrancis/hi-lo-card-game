#!/usr/bin/env bash
# Build the static site into deploy/, and optionally push it to S3.
#
#   ./build.sh                  build only
#   ./build.sh --deploy         build, then sync to S3 (asks before touching the bucket)
#   ./build.sh --deploy --yes   same, without the prompt (what GitHub Actions runs)
#
# deploy/ is gitignored and is wiped on every run, so it always matches the source.
set -euo pipefail

cd "$(dirname "$0")"
OUT="deploy"
BUCKET="portfolio-dominicfrancis"
PREFIX="hi-lo"
# Every path below goes through DEST. The bucket holds more than one site,
# so a sync with --delete that points at the bucket root erases the others.
# Build the destination once here and never write "s3://$BUCKET/" again.
DEST="s3://$BUCKET/$PREFIX"
DISTRIBUTION_ID="E3BVAHCA09RLS3"

# ---------------------------------------------------------------- build

# Only these ship. An allowlist (rather than "everything except") means a new
# stray file at the root can't silently end up on the bucket.
# documentation/ is Code Institute assessment material; package.json/jest are
# test tooling only. Neither belongs on the live site.
PAGES=(index.html game.html faq.html 404.html)
DIRS=(assets)

rm -rf "$OUT"
mkdir -p "$OUT"

for f in "${PAGES[@]}"; do
  cp "$f" "$OUT/$f"
done

for d in "${DIRS[@]}"; do
  # --exclude .*: macOS metadata must never reach S3.
  rsync -a --exclude '.*' "$d/" "$OUT/$d/"
done

# Belt and braces: strip any dotfiles that slipped through.
find "$OUT" -name '.DS_Store' -delete
find "$OUT" -name '._*' -delete

echo "Built $(find "$OUT" -type f | wc -l | tr -d ' ') files into $OUT/ ($(du -sh "$OUT" | cut -f1))"

[ "${1:-}" = "--deploy" ] || exit 0

# ---------------------------------------------------------------- deploy

command -v aws >/dev/null || { echo "error: aws CLI not installed (brew install awscli)" >&2; exit 1; }

# Fail before --delete can touch the wrong place.
aws s3 ls "$DEST/" >/dev/null 2>&1 \
  || { echo "error: cannot read $DEST/ — wrong bucket or prefix, or credentials not configured" >&2; exit 1; }

echo
echo "About to sync $OUT/ to $DEST/ with --delete."
echo "This removes anything in $PREFIX/ that is not in $OUT/. Other sites are not touched."
# --yes (or a CI environment) skips the prompt; anything interactive must confirm.
if [ "${2:-}" = "--yes" ] || [ -n "${CI:-}" ]; then
  echo "Non-interactive run, proceeding."
else
  read -r -p "Continue? [y/N] " reply
  [ "$reply" = "y" ] || [ "$reply" = "Y" ] || { echo "Aborted."; exit 1; }
fi

# Cache-Control is what makes deploys land without a CloudFront invalidation:
# CloudFront obeys these headers instead of falling back to its 24h default TTL.
aws s3 sync "$OUT/assets/" "$DEST/assets/" \
  --delete --cache-control "public, max-age=31536000, immutable"

# awscli guesses .svg from the extension and sometimes lands on
# binary/octet-stream, which stops browsers rendering the image.
find "$OUT/assets" -name '*.svg' -type f | while read -r f; do
  key="assets/${f#"$OUT"/assets/}"
  aws s3 cp "$DEST/$key" "$DEST/$key" \
    --metadata-directive REPLACE --content-type "image/svg+xml" \
    --cache-control "public, max-age=31536000, immutable"
done

# HTML last: a page must never go live referencing an asset that hasn't uploaded.
aws s3 sync "$OUT/" "$DEST/" \
  --delete --exclude "assets/*" --cache-control "no-cache"

echo
echo "Deployed to $DEST/"
if [ -n "$DISTRIBUTION_ID" ]; then
  echo "Only if something looks stale, invalidate:"
  echo "  aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"
fi
