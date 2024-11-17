import express from "express";
import { livroController } from "../src/Controller/LivroController.js";

const LivroRouter = express.Router();
const LivroController = new livroController();

LivroRouter.get('/', LivroController.getAll);
LivroRouter.get('/:id', LivroController.getId); 
LivroRouter.post('/', LivroController.cadastro); //Faz cadastro do livro(Produto) e da biblioteca(Estoque)
LivroRouter.put('/', LivroController.alterar); 
LivroRouter.delete('/:id', LivroController.deletar);

export { LivroRouter };