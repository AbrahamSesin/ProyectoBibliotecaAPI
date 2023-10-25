import {pool} from './database.js';

class LibroController{

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

        //Insertamos un nuevo libro dar de alta
    async add(req, res) {
        const libro = req.body;
        const camposValidos = ["nombre", "autor", "categoria", "aniopublicacion", "isbn"];
        
        try {
            // Verificar si se proporcionan campos inválidos
            const camposInvalidos = Object.keys(libro).filter(campo => !camposValidos.includes(campo));
            if (camposInvalidos.length > 0) {
                throw new Error(`Se proporcionaron campos inválidos: ${camposInvalidos.join(", ")}`);
            }
                
            // Insertar el libro en la base de datos
            const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, aniopublicacion, isbn) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.isbn]);
            res.json({"Id insertado": result.insertId});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

        //Implementacion de actualizacion del libro (Editar), con la implementacion de (try-catch) si recibimos el num de dato ISBN incorrecto
    async update(req, res) {
        const libro = req.body;
        const isbn_libro = parseInt(libro.isbn);
        
        try {
            // Verificar si el libro existe en la base de datos
            const [result] = await pool.query(`SELECT * FROM libros WHERE isbn=(?)`, [isbn_libro]);
            if (result.length === 0) {
                throw new Error('No se encontró ningún libro con el campo ISBN proporcionado');
            }
        
            // Realizar la modificación del libro
            const [updateResult] = await pool.query(`UPDATE libros SET nombre=?, autor=?, categoria=?, aniopublicacion=?, isbn=? WHERE isbn=?`, [libro.nombre, libro.autor, libro.categoria, libro.aniopublicacion, libro.isbn, isbn_libro]);
            res.json({"Actualización del libro exitosa": libro.nombre});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

        //Implementacion de eliminar libro a traves del campo ISBN con implementacion de  (try-catch)
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
        const isbn_libro = parseInt(libro.isbn);
        const [result] = await pool.query(`SELECT * FROM libros WHERE isbn=(?)`, [isbn_libro]);

        if (result[0] != undefined) {
            res.json(result);
        } else {
            res.json({"Error": "Ups, no se encuentran elemento isbn del libro"});
        }
    }
    
}

export const libro = new LibroController();