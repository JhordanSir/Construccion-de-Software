import os

from flask import Flask, request, jsonify, send_from_directory

# Create Flask app
app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def home():
    return "Hello, Flask! Welcome to Session 1."

@app.route("/about")
def about():
    return "This is the About page"

@app.route("/hello/<name>")
def hello(name):
    return f"Hello {name}!"

@app.route("/json")
def json_response():
    return {"status": "success", "message": "This is JSON!"}

@app.route("/ui")
def ui():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/style.css")
def style_file():
    return send_from_directory(BASE_DIR, "style.css")

@app.route("/script.js")
def script_file():
    return send_from_directory(BASE_DIR, "script.js")

tasks = []
users = []
next_user_id = 1

def _is_valid_user_payload(data):
    if not data:
        return False

    name = data.get("name", "")
    lastname = data.get("lastname", "")
    address = data.get("address", {})

    if name == "" or lastname == "":
        return False
    if not isinstance(address, dict):
        return False
    if address.get("city", "") == "":
        return False
    if address.get("country", "") == "":
        return False
    if address.get("code", "") == "":
        return False

    return True


def _find_user_by_id(user_id):
    for user in users:
        if user["id"] == user_id:
            return user
    return None

# GET - retrieve all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify({"tasks": tasks})

@app.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    if 0 <= task_id < len(tasks):
        return jsonify({"id": task_id, "content": tasks[task_id]["content"], "done": tasks[task_id]["done"]})
    return jsonify({"error": "Task not found"}), 404

# POST - add a new task
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    if data.get("content", "") == "":
        return jsonify({"error": "Content is required"}), 400
    task = {"id": len(tasks), "content": data.get("content", ""), "done": False}
    tasks.append(task)
    return jsonify({"message": "Task added!", "task": task}), 201

# PUT - update a task by ID
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    data = request.json
    if data.get("content", "") == "":
        return jsonify({"error": "Content is required"}), 400
    tasks[task_id]["content"] = data.get("content", tasks[task_id]["content"])
    tasks[task_id]["done"] = data.get("done", tasks[task_id]["done"])
    return jsonify({"message": "Task updated!", "task": tasks[task_id]})

# DELETE - delete a task by ID
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    removed = tasks.pop(task_id)
    return jsonify({"message": "Task deleted!", "task": removed})


# GET - retrieve all users
@app.route("/users", methods=["GET"])
def get_users():
    return jsonify({"users": users})


# GET - retrieve one user by ID
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = _find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)


# POST - create a new user
@app.route("/users", methods=["POST"])
def add_user():
    global next_user_id

    data = request.json
    if not _is_valid_user_payload(data):
        return jsonify({
            "error": "Invalid payload. Required: name, lastname, address.city, address.country, address.code"
        }), 400

    user = {
        "id": next_user_id,
        "name": data["name"],
        "lastname": data["lastname"],
        "address": {
            "city": data["address"]["city"],
            "country": data["address"]["country"],
            "code": data["address"]["code"],
        },
    }
    users.append(user)
    next_user_id += 1
    return jsonify({"message": "User added!", "user": user}), 201


# PUT - update an existing user
@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = _find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    if not _is_valid_user_payload(data):
        return jsonify({
            "error": "Invalid payload. Required: name, lastname, address.city, address.country, address.code"
        }), 400

    user["name"] = data["name"]
    user["lastname"] = data["lastname"]
    user["address"] = {
        "city": data["address"]["city"],
        "country": data["address"]["country"],
        "code": data["address"]["code"],
    }
    return jsonify({"message": "User updated!", "user": user})


# DELETE - delete user by ID
@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = _find_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    users.remove(user)
    return jsonify({"message": "User deleted!", "user": user})

if __name__ == "__main__":
    # Start development server
    app.run(debug=True)