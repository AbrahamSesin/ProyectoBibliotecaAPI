import {pool} from './database.js';

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    async add(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, aniopublicacion, isbn) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.isbn]);
        res.json({"Id insertado": result.insertId});
    }

    async getOne(req, res){
        const libro = req.body;
        const id_libro = parseInt(libro.id);
        const [result] =await pool.query(`SELECT * FROM libros WHERE id=(?)`, [id_libro]);

        if (result[0] != undefined) {
            res.json(result);
        } else {
            res.json({"Error": "Ups, no se encuentran elemento ID del libro"});
        }
    }
    
}

export const libro = new LibroController();