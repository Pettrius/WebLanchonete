// Variáveis globais
let loginData = {}; // Simula o banco de dados de usuários
let currentUser = null;
let pedidoItens = [];
let total = 0;
let deliveryOption = '';
let address = {};
let paymentMethod = '';
let paymentDetails = {};
let userWorkbook = null; // Livro de trabalho para armazenar os usuários

// Carregar dados do Excel ao iniciar o sistema
function loadLoginData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Converter os dados da planilha para o objeto loginData
            jsonData.forEach((row, index) => {
                if (index > 0 && row[0] && row[1]) { // Ignorar o cabeçalho
                    loginData[row[0]] = row[1]; // [Usuário, Senha]
                }
            });
            alert('Dados de login carregados com sucesso!');
        };
        reader.readAsArrayBuffer(file);
    };
    input.click();
}

// Função para mostrar apenas a tela especificada
function showScreen(screenId) {
    const screens = ['login-screen', 'register-screen', 'menu-screen', 'delivery-screen', 'payment-screen', 'completion-screen'];
    screens.forEach(id => {
        document.getElementById(id).style.display = id === screenId ? 'block' : 'none';
    });
}

// Registro de usuário
function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!username || !password) {
        alert('Preencha todos os campos para registrar.');
        return;
    }

    if (loginData[username]) {
        alert('Usuário já existe. Escolha outro nome.');
        return;
    }

    loginData[username] = password;
    alert('Conta criada com sucesso!');
    showScreen('login-screen');
}

// Login de usuário
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
        alert('Preencha todos os campos para fazer login.');
        return;
    }

    if (loginData[username] === password) {
        currentUser = username;
        alert(`Bem-vindo, ${currentUser}!`);
        showScreen('menu-screen');
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

// Adicionar item ao pedido
function adicionarItem(nome, preco) {
    pedidoItens.push({ nome, preco });
    total += preco;
    atualizarPedido();
}

// Atualizar itens e total do pedido
function atualizarPedido() {
    const pedidoItensDisplay = document.getElementById('pedido-itens');
    pedidoItensDisplay.innerHTML = '';
    pedidoItens.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;
        pedidoItensDisplay.appendChild(li);
    });
    document.getElementById('total').textContent = `Total: R$${total.toFixed(2)}`;
}

// Transição para tela de entrega ou retirada
function nextToDelivery() {
    if (pedidoItens.length === 0) {
        alert('Adicione itens ao pedido antes de continuar.');
        return;
    }
    showScreen('delivery-screen');
}

// Selecionar tipo de entrega
function setDeliveryOption(option) {
    deliveryOption = option;
    const addressSection = document.getElementById('address-section');
    const payAtCounter = document.getElementById('pay-at-counter');
    if (option === 'Entrega') {
        addressSection.style.display = 'block';
        payAtCounter.style.display = 'none';
    } else {
        addressSection.style.display = 'none';
        payAtCounter.style.display = 'block';
    }
}

// Transição para tela de pagamento
function nextToPayment() {
    if (deliveryOption === 'Entrega') {
        address = {
            rua: document.getElementById('street').value.trim(),
            bairro: document.getElementById('neighborhood').value.trim(),
            numero: document.getElementById('number').value.trim(),
            complemento: document.getElementById('complement').value.trim(),
            cep: document.getElementById('cep').value.trim(),
        };
        if (!address.rua || !address.bairro || !address.numero || !address.cep) {
            alert('Preencha todos os campos de endereço.');
            return;
        }
    }
    showScreen('payment-screen');
}

// Selecionar método de pagamento
function selectPaymentMethod(method) {
    paymentMethod = method;
    const cardDetails = document.getElementById('card-details');
    const cashDetails = document.getElementById('cash-details');
    const paymentDetailsSection = document.getElementById('payment-details');

    cardDetails.style.display = method.includes('Cartão') ? 'block' : 'none';
    cashDetails.style.display = method === 'Dinheiro' ? 'block' : 'none';
    paymentDetailsSection.style.display = 'block';
}

// Finalizar pedido
function completeOrder(localPayment = false) {
    const userName = document.getElementById('user-name').value.trim();

    if (!userName) {
        alert('Por favor, insira seu nome.');
        return;
    }

    if (paymentMethod === 'Cartão de Crédito' || paymentMethod === 'Cartão de Débito') {
        paymentDetails = {
            numero: document.getElementById('card-number').value.trim(),
            nome: document.getElementById('card-name').value.trim(),
            cvv: document.getElementById('card-cvv').value.trim(),
            validade: document.getElementById('card-expiry').value.trim(),
        };
        if (!paymentDetails.numero || !paymentDetails.nome || !paymentDetails.cvv || !paymentDetails.validade) {
            alert('Preencha todos os campos do cartão.');
            return;
        }
    } else if (paymentMethod === 'Dinheiro') {
        const cashAmount = parseFloat(document.getElementById('cash-amount').value.trim());
        if (isNaN(cashAmount) || cashAmount < total) {
            alert('Insira um valor válido para o pagamento.');
            return;
        }
    }

    saveOrderToExcel(userName);
    document.getElementById('completion-message').textContent = localPayment
        ? 'Seu pedido foi salvo e será pago no local.'
        : 'Pagamento aprovado! Seu pedido está sendo processado.';
    showScreen('completion-screen');
}

// Salvar dados no Excel
function saveOrderToExcel(userName) {
    const wb = XLSX.utils.book_new();
    const wsData = [
        ['Usuário', 'Senha', 'Nome', 'Itens', 'Total', 'Entrega/Rua', 'Pagamento'],
        [
            currentUser,
            loginData[currentUser],
            userName,
            pedidoItens.map(item => item.nome).join(', '),
            `R$${total.toFixed(2)}`,
            deliveryOption === 'Entrega' ? address.rua : 'Retirada no Balcão',
            paymentMethod,
        ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'pedido_lanchonete.xlsx');
}

// Voltar ao menu para novo pedido
function voltarAoMenu() {
    pedidoItens = [];
    total = 0;
    atualizarPedido();
    showScreen('menu-screen');
}

// Encerrar sistema
function encerrar() {
    alert('Sistema encerrado. Até a próxima!');
    location.reload();
}

window.onload = () => {
    loadLoginData();
};
