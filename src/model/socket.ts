import openSocket from "socket.io-client";
export const SERVER_URL = "http://192.168.1.224:8080"
export const socket = openSocket(SERVER_URL)