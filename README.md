# websocket-pingpong
A partir de cet exemple (websocket en FastAPI) :  
https://fastapi.tiangolo.com/advanced/websockets/  

Tu dois créer un jeu PONG :  
https://blog.devoreve.com/2018/06/06/creer-un-pong-en-javascript/  
  
Dont :  
- Le premier utilisateur qui arrive sur la page web (et donc sur le serveur websocket) est l’utilisateur de gauche sur PONG : le joueur
- Il peut appuyer sur le bouton jouer/arrêter
- Les utilisateurs suivants qui arrivent sur la page web sont des spectateurs : ils voient la partie en cours : mouvement des 2 raquettes et de la balle  

## Installation steps
1) ./build.sh
2) ./run.sh