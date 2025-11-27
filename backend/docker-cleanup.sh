#!/bin/bash
# ------------------------------------------------------------------
# 🧩 Docker Zombie Container Cleanup Utility
# ------------------------------------------------------------------
# This script identifies containers that Docker cannot stop/remove
# and kills their orphaned processes safely.
# Run as: sudo ./docker-cleanup.sh
# ------------------------------------------------------------------

echo "🔍 Checking for zombie or stuck Docker containers..."

# List all running containers
containers=$(sudo docker ps -q)

if [ -z "$containers" ]; then
  echo "✅ No running containers found."
else
  echo "🧾 Active containers:"
  sudo docker ps
fi

echo
echo "🚀 Checking container processes for zombie state..."

# Loop through each container and verify process control
for c in $(sudo docker ps -q); do
  pid=$(sudo docker inspect --format '{{.State.Pid}}' "$c" 2>/dev/null)
  if [ -n "$pid" ] && ! sudo nsenter -t "$pid" -a true 2>/dev/null; then
    echo "⚠️  Container $c (PID: $pid) appears orphaned."
    echo "   Attempting cleanup..."
    sudo kill -9 "$pid" 2>/dev/null
    sudo docker rm -f "$c" 2>/dev/null && echo "✅ Cleaned $c" || echo "❌ Failed to remove $c"
  fi
done

echo
echo "🧹 Removing any exited or dead containers..."
sudo docker container prune -f >/dev/null

echo
echo "🧩 Cleanup complete. Current container list:"
sudo docker ps -a
