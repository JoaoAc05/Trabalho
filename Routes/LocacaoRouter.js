import express from "express";
import { locacaoController } from "../src/Controller/LocacaoController.js";

const LocacaoRouter = express.Router();
const LocacaoController = new locacaoController();

LocacaoRouter.get('/', LocacaoController.getAll);
LocacaoRouter.get('/:id', LocacaoController.getId); 
LocacaoRouter.post('/', LocacaoController.cadastro); //Iniciar locação
LocacaoRouter.put('/', LocacaoController.alterar); 
LocacaoRouter.delete('/:id', LocacaoController.deletar);
LocacaoRouter.delete('/finalizar', LocacaoController.finalizar); //Finalizar locação

export { LocacaoRouter };