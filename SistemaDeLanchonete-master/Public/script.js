// Função de registro de usuário
function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !password) {
        alert('Preencha todos os campos para registrar.');
        return;
    }

    console.log('Tentando registrar usuário:', username); // Log para debug

    // Enviando os dados para o servidor para registrar o usuário
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        console.log('Resposta do servidor:', response); // Log para debug
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data); // Log para debug
        alert(data.message);
        if (data.status === 201) {
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
            showScreen('login-screen');
        }
    })
    .catch(error => {
        console.error('Erro completo:', error); // Log para debug
        alert('Erro ao registrar usuário: ' + (error.message || 'Erro desconhecido'));
    });
}

// Função de login de usuário
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert('Preencha todos os campos para fazer login.');
        return;
    }

    console.log('Tentando fazer login:', username); // Log para debug

    // Enviando os dados para o servidor para verificar o login
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        console.log('Resposta do servidor:', response); // Log para debug
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data); // Log para debug
        alert(data.message);
        if (data.status === 200) {
            currentUser = username;
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            showScreen('menu-screen');
        }
    })
    .catch(error => {
        console.error('Erro completo:', error); // Log para debug
        alert('Erro ao fazer login: ' + (error.message || 'Erro desconhecido'));
    });
}

// Função para alternar entre as telas
function showScreen(screenId) {
    console.log('Mudando para a tela:', screenId); // Log para debug
    const screens = ['login-screen', 'register-screen', 'menu-screen', 'delivery-screen', 'payment-screen', 'completion-screen'];
    screens.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = id === screenId ? 'block' : 'none';
        } else {
            console.error('Elemento não encontrado:', id); // Log para debug
        }
    });
}
