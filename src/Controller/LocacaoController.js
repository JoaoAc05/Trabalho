import { prisma } from "../prisma.js";

class locacaoController {
    async getAll(req, res) { 
        try {
            const locacao = await prisma.locacao.findMany()
            res.status(200).json(locacao);

            if (locacao.length === 0 ) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornarLocacao: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const locacao = await prisma.locacao.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!locacao) {
                return res.status(404).json({message: 'Não encontrado nenhum registro desta locacao'})
            }

            res.status(200).json(locacao)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar locacao: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const {id_livro, id_cliente, quantidade, valor} = req.body;

        if(Number(quantidade) <= 0) {
            return res.status(400).json({ message: 'Quantidade deve ser maior que 0' });
        }

        try {

            const livro = await prisma.livro.findUnique({
                where: {
                    id: Number(id_livro)
                }
            })
            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado.' });
            }

            const cliente = await prisma.usuario.findUnique({
                where: {
                    id: Number(id_cliente)
                }
            })
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }

            const biblioteca = await prisma.biblioteca.findFirst({
                where: {
                    id_livro: Number(id_livro)
                }
            })
            console.log(biblioteca.quantidade_disp)

            var disponivelAtual = biblioteca.quantidade_disp - Number(quantidade);

            if (disponivelAtual < 0){
                return res.status(401).json({message: 'Quantidade da locação maior do que o disponível'})
            }

            const createLocacao = await prisma.locacao.create({ 
                data: {
                    Livro: {
                        connect: {id: Number(id_livro)}
                    },
                    Usuario: {
                        connect: {id: Number(id_cliente)}
                    },
                    quantidade: Number(quantidade),
                    valor: parseFloat(valor)
                }
            });

            //Quando realizar a locação, reduzir a quantidade de livros disponíveis na biblioteca
            const updateBiblioteca = await prisma.biblioteca.updateMany({
                where: {
                    id_livro: Number(id_livro)
                },
                data: {
                    quantidade_disp: disponivelAtual
                }
            })
            console.log(updateBiblioteca)
            if(updateBiblioteca.length === 0) {
                return res.status(400).json({message: 'Erro ao reduzir a quantidade disponível da biblioteca.'})
            }

            res.status(201).json(createLocacao);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar locacao: ' + e.message });
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

            const updateLocacao = await prisma.locacao.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateLocacao.count === 0) {
                return res.status(404).json({ message: 'Locacao não encontrada.' });
            }
    
            res.status(200).json({ message: 'Locacao alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar locacao: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteLocacao = await prisma.locacao.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Locacao deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar locacao. ' + e.message})
        }
    }

    async finalizar(req, res) {
        // {id, data_devolucao} apenas
        const { id, data_devolucao } = req.body;
        const dataToUpdate = req.body;

        if (!data_devolucao || !id){
            return res.status(400).json({ message: 'Os campos id e data_devolucao são obrigatórios.' })
        }
        
        try {

            const updateLocacao = await prisma.locacao.updateMany({
                where: {
                    id: parseInt(id),
                },
                data:  dataToUpdate, 
            });
            if (updateLocacao.count === 0) {
                return res.status(400).json({ message: 'Locacao não encontrado.' });
            }

            const locacao = await prisma.locacao.findUnique({
                where: {
                    id: Number(id),
                },
            })

            const biblioteca = await prisma.biblioteca.findFirst({
                where: {
                    id_livro: Number(locacao.id_livro)
                }
            })

            var disponivelAtual = biblioteca.quantidade_disp + locacao.quantidade;

            //Quando finalizar a locação, voltar a quantidade de livros disponíveis na biblioteca
            const updateBiblioteca = await prisma.biblioteca.updateMany({
                where: {
                    id_livro: Number(locacao.id_livro)
                },
                data: {
                    quantidade_disp: disponivelAtual
                }
            })
            if(updateBiblioteca.length === 0) {
                return res.status(400).json({message: 'Erro ao voltar a quantidade disponível da biblioteca.'})
            }
    
            res.status(200).json({ message: 'Locacao finalizada com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao finalizar locacao: ' + e.message });
        }
    }
}
export { locacaoController };