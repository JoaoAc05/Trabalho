import { prisma } from "../prisma.js";

class bibliotecaController {

    constructor(){
        this.alterarAdicao = this.alterarAdicao.bind(this),
        this.alterarSubtracao = this.alterarSubtracao.bind(this)
    }

    async getAll(req, res) { 
        try {
            const bibliotecas = await prisma.biblioteca.findMany()
            res.status(200).json(bibliotecas);

            if (bibliotecas.length === 0 ) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar biblioteca: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const biblioteca = await prisma.biblioteca.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!biblioteca) {
                return res.status(404).json({message: 'Não encontrado nenhum registro desta biblioteca'})
            }

            res.status(200).json(biblioteca)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar biblioteca: ' + e.message})
        }
    };

    //Esta rota deve ser usada apenas em caso de erro. A bibloteca é cadastrada automaticamente junto ao cadastro do livro
    async cadastro(req, res) {
        const {id_livro, quantidade, quantidade_disp} = req.body;

        try {

            const livro = await prisma.livro.findUnique({
                where: {
                    id: Number(id_livro)
                }
            })
            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado.' });
            }

            const createBiblioteca = await prisma.biblioteca.create({ 
                data: {
                    Livro: {
                        connect: {id: Number(id_livro)}
                    },
                    quantidade: quantidade,
                    quantidade_disp: quantidade_disp
                }
            });
            res.status(201).json(createBiblioteca);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar biblioteca: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, id_livro } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {

            if(id_livro) {
                const livro = await prisma.livro.findUnique({
                    where: {
                        id: Number(id_livro)
                    }
                })
                if (!livro) {
                    return res.status(404).json({ message: 'Livro não encontrado.' });
                }
            }

            const updateBibliotecas = await prisma.biblioteca.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateBibliotecas.count === 0) {
                return res.status(404).json({ message: 'Biblioteca não encontrado.' });
            }
    
            res.status(200).json({ message: 'Biblioteca alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar biblioteca: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteBibliotecas = await prisma.biblioteca.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Biblioteca deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar biblioteca. ' + e.message})
        }
    }

    async alterarAdicao(req, res, next){
        const { id_livro } = req.body; 
        
        const quantidade = await this.getQuantidade(id_livro);
        req.body.quantidade = parseInt(req.body.quantidade) + parseInt(quantidade.quantidade)
        req.body.quantidade_disp = parseInt(req.body.quantidade) + parseInt(quantidade.quantidade_disp)
        
        try {
            const objAlterado = await prisma.biblioteca.updateMany({
                where: {
                    id_livro: Number(id_livro),
                },
                data: req.body
            })
            res.status(201).json(objAlterado);
        } catch (e) {
            res.status(500).json({error: 'Erro alterar estoque.'});
        }
    }

    async alterarSubtracao(req, res, next){
        const { id_livro } = req.body; 
        
        const quantidade = await this.getQuantidade(id_livro);
        req.body.quantidade = parseInt(quantidade.quantidade)- parseInt(req.body.quantidade) 
        req.body.quantidade_disp = parseInt(quantidade.quantidade_disp) - parseInt(req.body.quantidade)  
        
        try {
            const objAlterado = await prisma.biblioteca.updateMany({
                where: {
                    id_livro: Number(id_livro),
                },
                data: req.body 
            })
            res.status(201).json(objAlterado);
        } catch (e) {
            res.status(500).json({error: 'Erro alterar biblioteca.'});
        }
    }
    async getQuantidade(id_livro){
        const biblioteca = prisma.biblioteca.findFirst({
            where: {
                id_livro: parseInt(id_livro)
            }
        })
        return biblioteca
    }

}
export { bibliotecaController };