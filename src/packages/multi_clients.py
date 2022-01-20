from typing import List, Dict
from fastapi import WebSocket


class Client:
    active_connections: List[WebSocket] = []

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def private_message(self, data: Dict, websocket: WebSocket):
        await websocket.send_json(data)

    async def broadcast(self, data: Dict):
        for connection in self.active_connections:
            await connection.send_json(data)
