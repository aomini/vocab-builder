#!/bin/bash

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  echo '{"decision":"block","reason":"Pushing to main/master is not allowed. Create a feature branch first."}'
else
  echo '{"decision":"allow"}'
fi
