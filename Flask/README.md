# Guia de Instalación

## Python (app.py)
1. Create a new environment:  
```bash
conda create --name flask_env python=3.11
```

2. Activate environment:  
```bash
conda activate flask_env
```

3. Install Flask:  
```bash
pip install flask
```
4. Run the server:
```bash
python app.py
```

## Postman

### Tabla de endpoints
| Metodo | Endpoint | Descripcion |
|---|---|---|
| GET | / | Mensaje de bienvenida |
| GET | /about | Informacion de la pagina About |
| GET | /hello/{name} | Saludo personalizado por nombre |
| GET | /json | Respuesta JSON de prueba |
| GET | /tasks | Lista todas las tareas |
| GET | /tasks/{task_id} | Obtiene una tarea por ID |
| POST | /tasks | Crea una nueva tarea |
| PUT | /tasks/{task_id} | Actualiza una tarea por ID |
| DELETE | /tasks/{task_id} | Elimina una tarea por ID |
| GET | /users | Lista todos los usuarios |
| GET | /users/{user_id} | Obtiene un usuario por ID |
| POST | /users | Crea un nuevo usuario |
| PUT | /users/{user_id} | Actualiza un usuario por ID |
| DELETE | /users/{user_id} | Elimina un usuario por ID |

### Importar postman.json
1. Abre Postman.
2. Haz clic en **Import** (arriba a la izquierda).
3. Selecciona la pestaña **File**.
4. Haz clic en **Upload Files**.
5. Busca y selecciona el archivo `postman.json` dentro de la carpeta Flask.
6. Haz clic en **Import** para confirmar.

### Probar la colección
1. Asegúrate de tener el servidor Flask corriendo en `http://127.0.0.1:5000`.
2. En Postman, abre la colección importada.
3. Ejecuta primero `POST /tasks` o `POST /users` para crear datos.
4. Luego ejecuta `GET`, `PUT` y `DELETE` según necesites.
