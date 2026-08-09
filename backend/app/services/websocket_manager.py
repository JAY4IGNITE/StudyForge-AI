import json
import asyncio
from typing import Dict, Set, Any
from fastapi import WebSocket
from app.core.logging import logger
from app.schemas.websocket import WebSocketMessage

class ConnectionManager:
    def __init__(self):
        # Maps user_id to a set of their active WebSockets
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Maps room_id (e.g. interview_id) to a set of WebSockets
        self.rooms: Dict[str, Set[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected. Total connections for user: {len(self.active_connections[user_id])}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from all rooms
        for room_id, connections in list(self.rooms.items()):
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.rooms[room_id]
        logger.info(f"WebSocket disconnected for user {user_id}")

    def join_room(self, websocket: WebSocket, room_id: str):
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        logger.info(f"WebSocket joined room {room_id}")

    def leave_room(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            if websocket in self.rooms[room_id]:
                self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]
        logger.info(f"WebSocket left room {room_id}")

    async def send_personal_message(self, message: WebSocketMessage, websocket: WebSocket):
        try:
            await websocket.send_json(message.model_dump())
        except Exception as e:
            logger.error(f"Failed to send personal message: {e}")

    async def broadcast_to_room(self, message: WebSocketMessage, room_id: str, exclude: WebSocket = None):
        if room_id in self.rooms:
            dead_connections = set()
            for connection in self.rooms[room_id]:
                if connection == exclude:
                    continue
                try:
                    await connection.send_json(message.model_dump())
                except Exception as e:
                    logger.error(f"Error broadcasting to connection in room {room_id}: {e}")
                    dead_connections.add(connection)
            
            for dead in dead_connections:
                self.rooms[room_id].remove(dead)

# Global connection manager instance
manager = ConnectionManager()
