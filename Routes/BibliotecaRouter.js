import express from "express";
import { bibliotecaController } from "../src/Controller/BibliotecaController.js";

const BibliotecaRouter = express.Router();
const BibliotecaController = new bibliotecaController();

BibliotecaRouter.get('/', BibliotecaController.getAll);
BibliotecaRouter.get('/:id', BibliotecaController.getId); 
BibliotecaRouter.post('/', BibliotecaController.cadastro); 
BibliotecaRouter.put('/', BibliotecaController.alterar); 
BibliotecaRouter.delete('/:id', BibliotecaController.deletar);
BibliotecaRouter.delete('/adicionar', BibliotecaController.alterarAdicao);
BibliotecaRouter.delete('/subtrair', BibliotecaController.alterarSubtracao);

export { BibliotecaRouter };