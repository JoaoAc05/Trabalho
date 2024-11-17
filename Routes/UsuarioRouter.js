import express from "express";
import { usuarioController } from "../src/Controller/UsuarioController.js";

const UsuarioRouter = express.Router();
const UsuarioController = new usuarioController();

UsuarioRouter.get('/', UsuarioController.getAll);
UsuarioRouter.get('/:id', UsuarioController.getId); 
UsuarioRouter.post('/', UsuarioController.cadastro); 
UsuarioRouter.put('/', UsuarioController.alterar); 
UsuarioRouter.delete('/:id', UsuarioController.deletar);

export { UsuarioRouter };