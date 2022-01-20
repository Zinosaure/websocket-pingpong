import os
import json
from re import I
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from packages.multi_clients import Client

app = FastAPI()
app.mount('/public', StaticFiles(directory='www/public'), name='public')
templates = Jinja2Templates(directory='www/application/templates')
clients = Client()


def get_who_is_playing():
    with open('./player_data.txt', 'r+') as f:
        return f.read()


def set_who_is_playing(uid: str = ''):
    with open('./player_data.txt', 'w+') as f:
        f.write(uid)


@app.get('/', response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse('base_template.html', {'request': request})


@app.websocket('/ws/{uid}')
async def websocket_endpoint(websocket: WebSocket, uid: str):
    await clients.connect(websocket)

    try:
        while True:
            data = json.loads(await websocket.receive_text())

            if data['fn'] == 'start_game':
                set_who_is_playing(data['uid'])
            elif data['fn'] == 'stop_game':
                set_who_is_playing()
            elif data['fn'] == 'login':
                data['puid'] = get_who_is_playing()

            await clients.private_message(data, websocket)
            await clients.broadcast(data)
    except WebSocketDisconnect:
        puid = get_who_is_playing()
        
        if uid == puid:
            set_who_is_playing()

        clients.disconnect(websocket)
        await clients.broadcast({'fn': 'logout', 'uid': uid, 'puid': puid})
