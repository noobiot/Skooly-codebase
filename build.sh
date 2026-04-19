#!/bin/bash

if [ "$CF_PAGES_BRANCH" == "production" ]; then

  npm run production

elif [ "$CF_PAGES_BRANCH" == "staging" ]; then

  npm run staging

else

  npm run dev

fi
