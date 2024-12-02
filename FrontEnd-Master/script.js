// Função para alternar entre as telas
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.style.display = 'none');
    const screen = document.getElementById(screenId);
    screen.style.display = 'block';
}

// Função para fazer login
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (username && password) {
        // Enviar os dados de login para o servidor via AJAX
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showScreen('menu-screen');  // Exibe o menu após login
                localStorage.setItem('user_id', data.user.id); // Salvar user_id no localStorage
            } else {
                alert('Usuário ou senha incorretos.');
            }
        })
        .catch(error => {
            alert("Erro no login: " + error.message);
        });
    } else {
        alert("Por favor, preencha o usuário e a senha.");
    }
}

// Função para registrar um novo usuário
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const photoInput = document.getElementById('register-photo');
    const photo = photoInput.files[0];  // Obtém o arquivo de imagem selecionado

    if (username && password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        if (photo) {
            formData.append('photo', photo);  // Adiciona a foto ao FormData
        }

        // Enviar os dados de registro (incluindo a foto) para o servidor via AJAX
        fetch('http://localhost:3000/register', {
            method: 'POST',
            body: formData,  // Envia como FormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Usuário registrado com sucesso!");
                showScreen('login-screen');
            } else {
                alert("Erro ao registrar o usuário.");
            }
        })
        .catch(error => {
            alert("Erro no registro: " + error.message);
        });
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para adicionar itens ao pedido
let pedidoItens = [];
function adicionarItem(item, preco) {
    pedidoItens.push({ item, preco });
    atualizarPedido();
}

function atualizarPedido() {
    const pedidoUl = document.getElementById('pedido-itens');
    const totalElement = document.getElementById('total');
    
    pedidoUl.innerHTML = '';
    let total = 0;

    pedidoItens.forEach(pedido => {
        const li = document.createElement('li');
        li.textContent = `${pedido.item} - R$${pedido.preco.toFixed(2)}`;
        pedidoUl.appendChild(li);
        total += pedido.preco;
    });

    totalElement.textContent = `Total: R$${total.toFixed(2)}`;
}

// Função para continuar para a tela de entrega
function nextToDelivery() {
    if (pedidoItens.length === 0) {
        alert('Você precisa adicionar ao menos um item ao pedido.');
        return;
    }
    showScreen('delivery-screen');
}

// Função para selecionar a opção de entrega
function setDeliveryOption(option) {
    document.getElementById('address-section').style.display = option === 'Entrega' ? 'block' : 'none';
}

// Função para continuar para a tela de pagamento
function nextToPayment() {
    showScreen('payment-screen');
}

// Função para selecionar o método de pagamento
function selectPaymentMethod(method) {
    document.getElementById('payment-details').style.display = 'block';

    if (method === 'Dinheiro') {
        document.getElementById('cash-details').style.display = 'block';
        document.getElementById('card-details').style.display = 'none';
        document.getElementById('pay-at-counter').style.display = 'block';
    } else {
        document.getElementById('cash-details').style.display = 'none';
        document.getElementById('card-details').style.display = 'block';
        document.getElementById('pay-at-counter').style.display = 'none';
    }
}

// Função para finalizar o pedido
function completeOrder(paymentMethod) {
    const userName = document.getElementById('user-name').value;

    if (!userName) {
        alert('Por favor, preencha seu nome.');
        return;
    }

    // Enviar o pedido para o servidor via AJAX
    const endereco = document.getElementById('address-section').style.display === 'block' ? {
        rua: document.getElementById('street').value,
        bairro: document.getElementById('neighborhood').value,
        numero: document.getElementById('number').value,
        complemento: document.getElementById('complement').value,
        cep: document.getElementById('cep').value
    } : null;

    const user_id = localStorage.getItem('user_id');
    const pedidoData = {
        user_id,
        items: JSON.stringify(pedidoItens),
        total: parseFloat(document.getElementById('total').textContent.replace('Total: R$', '').replace(',', '.')) ,
        entrega: document.getElementById('address-section').style.display === 'block' ? 'Entrega' : 'Retirada no Balcão',
        pagamento: paymentMethod,
        endereco: JSON.stringify(endereco)
    };

    // Enviar pedido para o servidor
    fetch('http://localhost:3000/completeOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showScreen('completion-screen');
            document.getElementById('completion-message').textContent = `Obrigado pelo seu pedido, ${userName}!`;
        } else {
            alert("Erro ao completar o pedido.");
        }
    })
    .catch(error => {
        alert("Erro ao completar o pedido: " + error.message);
    });
}

// Função para voltar ao menu e fazer um novo pedido
function voltarAoMenu() {
    pedidoItens = [];
    showScreen('menu-screen');
}

// Função para encerrar
function encerrar() {
    alert('Obrigado! Até logo.');
}
