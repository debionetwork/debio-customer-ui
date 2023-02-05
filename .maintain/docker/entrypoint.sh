#!/bin/sh

export VUE_APP_VERSION=`cat /usr/share/nginx/app_version.txt`

JSON_STRING='window.configs = { \
  "VUE_APP_VERSION":"'"${VUE_APP_VERSION}"'", \
  "VUE_APP_RECAPTCHA_SITE_KEY":"'"${VUE_APP_RECAPTCHA_SITE_KEY}"'", \
  "VUE_APP_ROLE":"'"${VUE_APP_ROLE}"'", \
  "VUE_APP_DEBIO_SUBSTRATE_WS":"'"${VUE_APP_DEBIO_SUBSTRATE_WS}"'", \
  "VUE_APP_WEB3_RPC":"'"${VUE_APP_WEB3_RPC}"'", \
  "VUE_APP_BACKEND_API":"'"${VUE_APP_BACKEND_API}"'", \
  "VUE_APP_DEBIO_API_KEY":"'"${VUE_APP_DEBIO_API_KEY}"'", \
  "VUE_APP_USERNAME":"'"${VUE_APP_USERNAME}"'", \
  "VUE_APP_PASSWORD":"'"${VUE_APP_PASSWORD}"'", \
  "VUE_APP_MIXPANEL_TOKEN":"'"${VUE_APP_MIXPANEL_TOKEN}"'", \
  "VUE_APP_SENTRY_DSN":"'"${VUE_APP_SENTRY_DSN}"'", \
  "VUE_APP_PINATA_GATEWAY":"'"${VUE_APP_PINATA_GATEWAY}"'", \
  "VUE_APP_PINATA_JWT_KEY":"'"${VUE_APP_PINATA_JWT_KEY}"'", \
  "VUE_APP_DEBIO_USDT_TOKEN_ID":"'"${VUE_APP_DEBIO_USDT_TOKEN_ID}"'", \
  "VUE_APP_PINATA_REQUIRED_DOCUMENT":"'"${VUE_APP_PINATA_REQUIRED_DOCUMENT}"'", \
  "VUE_APP_OCTOPUS_EXPLORER":"'"${VUE_APP_OCTOPUS_EXPLORER}"'", \
  "VUE_APP_SERVICE_REQUEST_LINK":"'"${VUE_APP_SERVICE_REQUEST_LINK}"'", \
  "VUE_APP_PHYSICAL_HEALTH_TIMELINE_ID":"'"${VUE_APP_PHYSICAL_HEALTH_TIMELINE_ID}"'", \
  "VUE_APP_MENTAL_HEALTH_TIMELINE_ID":"'"${VUE_APP_MENTAL_HEALTH_TIMELINE_ID}"'", \
  "VUE_APP_MYRIAD_URL":"'"${VUE_APP_MYRIAD_URL}"'" \
}'

sed -i "s~// CONFIGURATIONS_PLACEHOLDER~${JSON_STRING}~" /usr/share/nginx/html/index.html

exec "$@"