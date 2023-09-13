import openSocket from "socket.io-client";

const home = "http://192.168.0.2:8080";
const school = "http://130.229.177.235:8080"
const server = "https://chess-server-z0of.onrender.com";
export const SERVER_URL = server;
export const socket = openSocket(SERVER_URL)