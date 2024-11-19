import { prisma } from "../prisma.js";

class livroController {
    async getAll(req, res) { 
        try {
            const livros = await prisma.livro.findMany()
            res.status(200).json(livros);
            if (livros.length === 0 ) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar livro: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const livro = await prisma.livro.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!livro) {
                return res.status(404).json({message: 'Não encontrado nenhum registro deste livro'})
            }

            res.status(200).json(livro)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar livro: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const { nome, paginas, autor, editora, valor, quantidade} = req.body;

        if(Number(quantidade) <= 0) {
            return res.status(400).json({ message: 'Quantidade deve ser maior que 0' });
        }
        
        try {
            const createLivro = await prisma.livro.create({ 
                data: {
                    nome: nome,
                    paginas: paginas,
                    autor: autor, 
                    editora: editora,
                    valor: valor
                } 
            });
            if(createLivro.length === 0) {
                return res.status(400).json({messagem: 'Erro ao cadastrar livro'})
            }

            //Assim que cadastrar o livro, fazer o cadastro da biblioteca com: id do livro criado, quantidade informada no post
            const createBiblioteca = await prisma.biblioteca.create({ 
                data: {
                    Livro: {
                        connect: {id: Number(createLivro.id)}
                    },
                    quantidade: Number(quantidade),
                    quantidade_disp: Number(quantidade)
                },
                include: {
                    Livro: true // Trazer detalhes do livro
                }
            });
            if(createBiblioteca.length === 0) {
                return res.status(400).json({messagem: 'Erro ao cadastrar estoque do livro'})
            }

            res.status(201).json(createBiblioteca);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar livro: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateLivros = await prisma.livro.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateLivros.count === 0) {
                return res.status(404).json({ message: 'Livro não encontrado.' });
            }
    
            res.status(200).json({ message: 'Livro alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar livro: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteLivros = await prisma.livro.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Livro deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar livro. ' + e.message})
        }
    }
}
export { livroController };