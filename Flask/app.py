from flask import Flask

# Create Flask app
app = Flask(__name__)

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

from flask import request, jsonify

tasks = []  # store tasks in memory

# GET - retrieve all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify({"tasks": tasks})

@app.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    if 0 <= task_id < len(tasks):
        return jsonify({"id": task_id, "content": tasks[task_id]["content"]})
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

if __name__ == "__main__":
    # Start development server
    app.run(debug=True)


