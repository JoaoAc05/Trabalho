import { prisma } from "../prisma.js";

class usuarioController {
    async getAll(req, res) { 
        try {
            const usuarios = await prisma.usuario.findMany()
            res.status(200).json(usuarios);

        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar usuário'});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!usuario) {
                return res.status(404).json({message: 'Não encontrado nenhum registro deste usuario'})
            }

            res.status(200).json(usuario)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar usuario: ' + e.message})
        }
    };

    async cadastro(req, res) {
        try {
            const createUsuario = await prisma.usuario.create({ data: req.body });
            res.status(201).json(createUsuario);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar usuario: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateUsuarios = await prisma.usuario.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateUsuarios.count === 0) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }
    
            res.status(200).json({ message: 'Usuario alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar usuario: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteUsuarios = await prisma.usuario.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Usuario deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar usuario. ' + e.message})
        }
    }
}
export { usuarioController };