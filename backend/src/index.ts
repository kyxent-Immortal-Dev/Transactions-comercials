import { Enviroments } from "./envs/Enviroments.service";
import { Server } from "./server";
import express from "express";

const server = new Server(express(), Enviroments.PORT);

server.initServer();
