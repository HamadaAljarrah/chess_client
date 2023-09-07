import openSocket from "socket.io-client";
export const SERVER_URL = "http://192.168.0.2:8080"
//export const SERVER_URL = "130.229.133.96:8080"
export const socket = openSocket(SERVER_URL)