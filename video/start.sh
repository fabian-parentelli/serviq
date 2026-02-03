trap "kill 0" EXIT

(cd serviq && pnpm start) &
sleep 1

(cd gateway && pnpm start) &
(cd ms_users && pnpm start) &
wait

# chmod +x start.sh
# ./start.sh