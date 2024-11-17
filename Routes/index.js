import express from "express";
import { UsuarioRouter } from "./UsuarioRouter.js";
import { LivroRouter } from "./LivroRouter.js";
import { BibliotecaRouter } from "./BibliotecaRouter.js";
import { LocacaoRouter } from "./LocacaoRouter.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'Rota default'});
});

router.use("/usuario", UsuarioRouter);
router.use("/livro", LivroRouter);
router.use("/biblioteca", BibliotecaRouter);
router.use("/locacao", LocacaoRouter);


export default router;