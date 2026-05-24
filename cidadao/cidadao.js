const API_URL = 'http://localhost:8080/api';
let latitude = null;
let longitude = null;
let marcador = null;

// Inicializa o mapa centrado no Brasil (visão padrão caso o GPS falhe)
const mapa = L.map('mapa').setView([-15.7801, -47.9292], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapa);

// --- Loc atual ---
// Pede permissão e busca a localização (dá zoom máximo de 16 para não ficar muito perto)
mapa.locate({ setView: true, maxZoom: 16 });

// Se encontrar a localização com sucesso
mapa.on('locationfound', function (e) {
    latitude  = e.latlng.lat.toFixed(6);
    longitude = e.latlng.lng.toFixed(6);

    // Preenche o input do HTML
    document.getElementById('localizacao').value = `${latitude}, ${longitude}`;

    // Remove o marcador anterior, se houver, e adiciona o novo na posição atual
    if (marcador) mapa.removeLayer(marcador);
    marcador = L.marker([latitude, longitude]).addTo(mapa)
        .bindPopup("Sua localização atual").openPopup();
});

// Se o usuário negar o GPS ou der erro
mapa.on('locationerror', function (e) {
    console.log("Erro ao acessar GPS ou permissão negada.");
    alert("Não foi possível acessar sua localização automática. Por favor, clique no mapa para indicar o local da ocorrência.");
});

// --- CLIQUE NO MAPA PARA SELECIONAR LOCALIZAÇÃO MANUALMENTE ---
mapa.on('click', function (e) {
    latitude  = e.latlng.lat.toFixed(6);
    longitude = e.latlng.lng.toFixed(6);

    document.getElementById('localizacao').value = `${latitude}, ${longitude}`;

    // Remove marcador anterior
    if (marcador) mapa.removeLayer(marcador);
    marcador = L.marker([latitude, longitude]).addTo(mapa);
});

// --- FUNÇÃO DE CADASTRO DA OCORRÊNCIA ---
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

// --- FUNÇÃO PARA LIMPAR O FORMULÁRIO APÓS O ENVIO ---
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

// --- FUNÇÃO DE LOGOUT ---
function logout() {
    localStorage.removeItem('tipo');
    window.location.href = '../login/login.html';
}