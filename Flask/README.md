# Guia de Instalación

## Python (app.py)
1. Crear un nuevo environment:  
```bash
conda create --name flask_env python=3.11
```

2. Activar environment:  
```bash
conda activate flask_env
```

3. Instalar Flask:  
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

## Frontend

### Acceder al Panel
1. Asegúrate de tener el servidor Flask corriendo (`python app.py`).
2. Abre tu navegador web.
3. Ingresa al  URL:
   ```
   http://127.0.0.1:5000/ui
   ```

### Uso del Panel (UI)
El panel cuenta con dos secciones principales totalmente funcionales que se comunican con los endpoints de Flask:

#### 1. Gestión de Tareas (Tasks)
- **Ver tareas:** La lista se carga automáticamente. Puedes refrescarla usando el botón **Refresh**.
- **Añadir tarea:** Escribe el contenido en el campo de texto y haz clic en **Add Task**.
- **Completar/Deshacer:** Usa el botón de acción en la tabla para marcar la tarea como terminada o deshacerla.
- **Eliminar:** Usa el botón rojo **Eliminar** para borrar la tarea definitivamente.

#### 2. Gestión de Usuarios (Users)
- **Ver usuarios:** La tabla inferior muestra todos los usuarios.
- **Crear usuario:** Completa el formulario con los datos requeridos (Name, Lastname, City, Country, Postal Code) y haz clic en **Create User**.
- **Editar usuario:** Haz clic en **Editar** en la tabla. El formulario se llenará con los datos del usuario. Realiza los cambios y haz clic en **Actualizar Usuario**.
- **Limpiar formulario:** Usa el botón **Clear** para vaciar el formulario y volver al modo de creación.
- **Eliminar usuario:** Haz clic en el botón rojo **Eliminar** en la tabla para borrar un registro.


