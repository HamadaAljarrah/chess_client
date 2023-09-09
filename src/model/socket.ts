import openSocket from "socket.io-client";
//export const SERVER_URL = "https://chess-server-z0of.onrender.com"
export const SERVER_URL = "http://192.168.0.2:8080"
export const socket = openSocket(SERVER_URL)