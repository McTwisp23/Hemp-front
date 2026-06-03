#!/bin/bash
set -e
cd "$(dirname "$0")"

PORT=8080
echo "Servindo o site em http://localhost:${PORT} ..."
python3 -m http.server ${PORT}
