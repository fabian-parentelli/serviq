trap "kill 0" EXIT

node serviq/broker.js &

sleep 1
node --watch gateway/src/app.js &
node --watch serviq/queue.js &
node --watch ms_user/src/app.js &
node --watch ms_product/src/app.js &

wait

# chmod +x start.sh
# ./start.sh