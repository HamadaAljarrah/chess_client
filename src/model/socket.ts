import openSocket from "socket.io-client";
export const SERVER_URL = "https://chess-server-z0of.onrender.com"
//export const SERVER_URL = "130.229.146.93:8080"
export const socket = openSocket(SERVER_URL)