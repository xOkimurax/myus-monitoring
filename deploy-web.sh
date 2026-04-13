#!/bin/bash
# Deploy Myus Web Panel to Vercel
# Usage: ./deploy-web.sh

cd myus_web

# Build first
pnpm install
pnpm build

# Deploy to Vercel (requires VERCEL_TOKEN env var for CI/CD)
if [ -n "$VERCEL_TOKEN" ]; then
  npx vercel deploy dist --prod --token=$VERCEL_TOKEN
else
  echo "Set VERCEL_TOKEN environment variable for automated deployment"
  echo "Or run: npx vercel deploy dist --prod"
fi
