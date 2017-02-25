### gury-multiplayer
Client-server multiplayer game written in C language

### Compiling:
Compile server by:
```
cmake .
make
```
### Running:
`./server` to run server first

`./server debug` is optional to print incoming messages in terminal

Then `python client.py <ip address> <port>` default port is 4444.

Browser with game should start up.

### In game:
`space` to jump, pressed after one results in shorter double-jump

`enter` to super-jump - limited to 3 per run per player.

TO DO:
- [ ] Separate thread for communication with each player
- [ ] Lag compensation
- [ ] Equal length of messages 
- [ ] Rewrite communication from position to jump-event based.
