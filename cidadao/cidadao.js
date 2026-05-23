const API_URL = 'http://localhost:8080/api';
let latitude = null;
let longitude = null;
let marcador = null;

// inicializa o mapa centrado no Brasil
const mapa = L.map('mapa').setView([-15.7801, -47.9292], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

// clique no mapa para selecionar localização
mapa.on('click', function (e) {
    latitude  = e.latlng.lat.toFixed(6);
    longitude = e.latlng.lng.toFixed(6);

    document.getElementById('localizacao').value = `${latitude}, ${longitude}`;

  // remove marcador anterior
    if (marcador) mapa.removeLayer(marcador);
    marcador = L.marker([latitude, longitude]).addTo(mapa);
});

async function cadastrarOcorrencia() {
    const erro    = document.getElementById('erro');
    const sucesso = document.getElementById('sucesso');
    erro.style.display    = 'none';
    sucesso.style.display = 'none';

    const titulo    = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const idTipo    = parseInt(document.getElementById('tipo').value);
    const idGravidade = parseInt(document.getElementById('gravidade').value);
    const idBairro  = parseInt(document.getElementById('bairro').value);

    if (!titulo || !descricao) {
    erro.textContent = 'Preencha título e descrição!';
    erro.style.display = 'block';
    return;
    }

    if (!latitude || !longitude) {
    erro.textContent = 'Clique no mapa para selecionar a localização!';
    erro.style.display = 'block';
    return;
    }

    try {
    const response = await fetch(`${API_URL}/ocorrencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        titulo,
        descricao,
        idTipo,
        idGravidade,
        idBairro,
        idUsuarioCriador: 1, // depois substituímos pelo id do usuário logado
        latitude,
        longitude
        })
    });

    const data = await response.json();

    if (data.sucesso) {
        sucesso.textContent = 'Ocorrência registrada com sucesso!';
        sucesso.style.display = 'block';
        limparFormulario();
    } else {
        erro.textContent = data.mensagem || 'Erro ao registrar!';
        erro.style.display = 'block';
    }

    } catch (error) {
    erro.textContent = 'Erro ao conectar com o servidor!';
    erro.style.display = 'block';
    }
}

function limparFormulario() {
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('localizacao').value = '';
    latitude = null;
    longitude = null;
    if (marcador) {
    mapa.removeLayer(marcador);
    marcador = null;
    }
}

function logout() {
    localStorage.removeItem('tipo');
    window.location.href = '../login/login.html';
}