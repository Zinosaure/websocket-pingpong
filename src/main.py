import json
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from packages.multi_clients import Client

app = FastAPI()
app.mount('/public', StaticFiles(directory='www/public'), name='public')
templates = Jinja2Templates(directory='www/application/templates')
clients = Client()

@app.get('/', response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse('base_template.html', {'request': request})


@app.websocket('/ws/{uid}')
async def websocket_endpoint(websocket: WebSocket, uid: str):
    await clients.connect(websocket)

    try:
        while True:
            data = json.loads(await websocket.receive_text())
            await clients.private_message(data, websocket)
            await clients.broadcast(data)
    except WebSocketDisconnect:
        clients.disconnect(websocket)
        await clients.broadcast({'fn': 'disconnect', 'uid': uid})
