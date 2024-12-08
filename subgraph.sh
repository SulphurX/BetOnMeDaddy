#!/user/bin/bash
graph init --from-contract $1 --abi $2 --network $3 --protocol $4 $5 $6

graph auth $7

cd $5

graph build && graph deploy