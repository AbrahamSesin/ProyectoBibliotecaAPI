import {pool} from './database.js';

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

        //Insertamos un nuevo libro
    async add(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, aniopublicacion, isbn) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.isbn]);
        res.json({"Id insertado": result.insertId});
    }

    async delete(req, res) {
        try {
            const libro = req.body;
            const isbn_libro = parseInt(libro.isbn);
            const [result] = await pool.query(`DELETE FROM libros WHERE isbn=(?)`, [isbn_libro]);
    
            if (result.affectedRows === 0) {
                throw new Error('No se encontró ningún libro con el campo ISBN proporcionado');
            }
    
            res.json({"Libro eliminado por el campo ISBN": result.affectedRows});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getOne(req, res){
        const libro = req.body;
        const id_libro = parseInt(libro.isbn);
        const [result] = await pool.query(`SELECT * FROM libros WHERE isbn=(?)`, [id_libro]);

        if (result[0] != undefined) {
            res.json(result);
        } else {
            res.json({"Error": "Ups, no se encuentran elemento isbn del libro"});
        }
    }
    
}

export const libro = new LibroController();