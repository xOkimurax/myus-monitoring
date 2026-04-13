#!/bin/bash
# Deploy Myus Backend Edge Functions to Insforge
# Usage: ./deploy-backend.sh

cd myus_backend

# Deploy each edge function
echo "Deploying auth-login..."
npx @insforge/cli functions deploy auth-login

echo "Deploying auth-register..."
npx @insforge/cli functions deploy auth-register

echo "Deploying notifications-sync..."
npx @insforge/cli functions deploy notifications-sync

echo "Deploying contacts-sync..."
npx @insforge/cli functions deploy contacts-sync

echo "Deploying call-logs-sync..."
npx @insforge/cli functions deploy call-logs-sync

echo "Deploying locations-sync..."
npx @insforge/cli functions deploy locations-sync

echo "Deploying files-sync..."
npx @insforge/cli functions deploy files-sync

echo "Done!"
