document.addEventListener('DOMContentLoaded', () => {
    // Elements Tasks
    const tasksTbody = document.querySelector('section:nth-of-type(1) tbody');
    const tasksForm = document.querySelector('section:nth-of-type(1) form');
    const tasksRefreshBtn = document.querySelector('section:nth-of-type(1) > div button');
    
    // Elements Users
    const usersTbody = document.querySelector('section:nth-of-type(2) tbody');
    const usersForm = document.querySelector('section:nth-of-type(2) form');
    const usersRefreshBtn = document.querySelector('section:nth-of-type(2) > div button');
    const usersClearBtn = usersForm.querySelector('button[type="button"]');
    const userSubmitBtn = usersForm.querySelector('button[type="submit"]');
    
    // Toast Container
    const toastContainer = document.querySelector('body > div:last-child:not(main)');

    // --- UTILS ---
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.background = type === 'error' ? '#ef4444' : '#10b981';
        toast.style.color = 'white';
        toast.style.padding = '1rem';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        
        if (toastContainer) {
            toastContainer.appendChild(toast);
        } else {
            document.body.appendChild(toast);
        }
        
        // Fade in
        setTimeout(() => toast.style.opacity = '1', 10);
        
        // Remove after 3s
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- TASKS ---
    async function fetchTasks() {
        try {
            const res = await fetch('/tasks');
            const data = await res.json();
            renderTasks(data.tasks);
        } catch (error) {
            showToast('Error al obtener tareas', 'error');
        }
    }

    function renderTasks(tasks) {
        tasksTbody.innerHTML = '';
        tasks.forEach((task, index) => {
            const tr = document.createElement('tr');
            
            const tdId = document.createElement('td');
            tdId.textContent = index; // Usamos el índice porque el backend usa índice para editar/eliminar
            
            const tdContent = document.createElement('td');
            tdContent.textContent = task.content;
            if (task.done) tdContent.style.textDecoration = 'line-through';
            
            const tdDone = document.createElement('td');
            tdDone.textContent = task.done ? 'Sí' : 'No';
            
            const tdActions = document.createElement('td');
            
            const btnToggle = document.createElement('button');
            btnToggle.textContent = task.done ? 'Deshacer' : 'Completar';
            btnToggle.onclick = () => toggleTask(index, task.content, task.done);
            
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Eliminar';
            btnDelete.style.backgroundColor = '#ef4444';
            btnDelete.onclick = () => deleteTask(index);
            
            tdActions.append(btnToggle, btnDelete);
            tr.append(tdId, tdContent, tdDone, tdActions);
            tasksTbody.appendChild(tr);
        });
    }

    tasksForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('taskContent').value;
        try {
            const res = await fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                showToast('Tarea agregada exitosamente');
                tasksForm.reset();
                fetchTasks();
            } else {
                showToast('Error al agregar tarea', 'error');
            }
        } catch (error) {
            showToast('Error de red al agregar tarea', 'error');
        }
    });

    async function toggleTask(id, content, currentStatus) {
        try {
            const res = await fetch(`/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, done: !currentStatus })
            });
            if (res.ok) fetchTasks();
        } catch (error) {
            showToast('Error al actualizar tarea', 'error');
        }
    }

    async function deleteTask(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
        try {
            const res = await fetch(`/tasks/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Tarea eliminada exitosamente');
                fetchTasks();
            }
        } catch (error) {
            showToast('Error al eliminar tarea', 'error');
        }
    }

    tasksRefreshBtn.addEventListener('click', fetchTasks);

    // --- USERS ---
    async function fetchUsers() {
        try {
            const res = await fetch('/users');
            const data = await res.json();
            renderUsers(data.users);
        } catch (error) {
            showToast('Error al obtener usuarios', 'error');
        }
    }

    function renderUsers(users) {
        usersTbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            
            const fields = [
                user.id,
                user.name,
                user.lastname,
                user.address.city,
                user.address.country,
                user.address.code
            ];
            
            fields.forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                tr.appendChild(td);
            });
            
            const tdActions = document.createElement('td');
            
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Editar';
            btnEdit.onclick = () => editUser(user.id);
            
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Eliminar';
            btnDelete.style.backgroundColor = '#ef4444';
            btnDelete.onclick = () => deleteUser(user.id);
            
            tdActions.append(btnEdit, btnDelete);
            tr.appendChild(tdActions);
            
            usersTbody.appendChild(tr);
        });
    }

    usersForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        
        const payload = {
            name: document.getElementById('userName').value,
            lastname: document.getElementById('userLastname').value,
            address: {
                city: document.getElementById('userCity').value,
                country: document.getElementById('userCountry').value,
                code: document.getElementById('userCode').value
            }
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/users/${id}` : '/users';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                showToast(id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
                clearUserForm();
                fetchUsers();
            } else {
                const data = await res.json();
                showToast(data.error || 'Error al guardar usuario', 'error');
            }
        } catch (error) {
            showToast('Error de red al guardar usuario', 'error');
        }
    });

    async function editUser(id) {
        try {
            const res = await fetch(`/users/${id}`);
            if (res.ok) {
                const user = await res.json();
                document.getElementById('userId').value = user.id;
                document.getElementById('userName').value = user.name;
                document.getElementById('userLastname').value = user.lastname;
                document.getElementById('userCity').value = user.address.city;
                document.getElementById('userCountry').value = user.address.country;
                document.getElementById('userCode').value = user.address.code;
                
                userSubmitBtn.textContent = 'Actualizar Usuario';
                window.scrollTo({ top: usersForm.offsetTop - 50, behavior: 'smooth' });
            }
        } catch (error) {
            showToast('Error al obtener detalles del usuario', 'error');
        }
    }

    async function deleteUser(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
        try {
            const res = await fetch(`/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Usuario eliminado exitosamente');
                fetchUsers();
            }
        } catch (error) {
            showToast('Error al eliminar usuario', 'error');
        }
    }

    function clearUserForm() {
        usersForm.reset();
        document.getElementById('userId').value = '';
        userSubmitBtn.textContent = 'Create User';
    }

    usersClearBtn.addEventListener('click', clearUserForm);
    usersRefreshBtn.addEventListener('click', fetchUsers);

    // Initial Load
    fetchTasks();
    fetchUsers();
});