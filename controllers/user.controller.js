const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener usuarios', error})
    }
}

const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const nuevoUsuario = await User.create(userData);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({message: 'Error al crear usuario ', error})
    }
}

const deleteUser = async (req,res) => {
    try {
        const { id } = req.params;
        const usuario = await User.find({_id: id});
        if (!usuario) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        const usuarioEliminado = await User.deleteOne({_id: id});
        res.status(200).json({message: 'Usuario eliminado correctamente', usuarioEliminado });
    }
    catch (error) {
        res.status(500).json({messsage: 'Error al eliminar usuario:', error});
    }
}

const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const usuarioActualizado = await User.findByIdAndUpdate(id, req.body, {new: true});
        const usuario = await User.find({_id: id});
        if (!usuario) {
            return res.status(404).json({message: 'Usuario no encontrando'});
        }
        res.status(200).json({message: 'Usuario actualizado correctamente', usuarioActualizado});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar usuario', error});
    }
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser
};