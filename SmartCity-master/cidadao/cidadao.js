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
                idGravidade: 1,
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
            setTimeout(() => {
        window.location.href = '../usuario.html';
    }, 2000);
        } else {
            erro.textContent = data.mensagem || 'Erro ao registrar!';
            erro.style.display = 'block';
        }

    } catch (error) {
        erro.textContent = 'Erro ao conectar com o servidor!';
        erro.style.display = 'block';
    }
}

// FUNÇÃO PARA LIMPAR O FORMULÁRIO APÓS O ENVIO
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

//FUNÇÃO DE LOGOUT
function logout() {
    localStorage.removeItem('tipo');
    window.location.href = '../login/login.html';
}

//ÍCONES POR TIPO DE OCORRÊNCIA
const icones = {
    1: { emoji: '🔧', cor: '#e67e22', label: 'Infraestrutura' },
    2: { emoji: '🚨', cor: '#e74c3c', label: 'Segurança'      },
    3: { emoji: '🏥', cor: '#3498db', label: 'Saúde'          },
    4: { emoji: '🌿', cor: '#27ae60', label: 'Meio Ambiente'  }
};

function criarIcone(idTipo) {
    const tipo = icones[idTipo] || { emoji: '📍', cor: '#7f8c8d', label: 'Outro' };
    return L.divIcon({
        className: '',
        html: `<div style="
            background:${tipo.cor};
            color:white;
            border-radius:50%;
            width:36px;height:36px;
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
            border:2px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
        ">${tipo.emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
}

//CARREGA OCORRÊNCIAS PRÓXIMAS
const marcadoresOcorrencias = [];

async function carregarOcorrenciasProximas(lat, lng) {
    try {
        const resp = await fetch(
            `http://localhost:8080/ocorrencias/proximas?lat=${lat}&lng=${lng}&raioKm=5`
        );
        const ocorrencias = await resp.json();

        // Remove os marcadores antigos do mapa
        marcadoresOcorrencias.forEach(m => mapa.removeLayer(m));
        marcadoresOcorrencias.length = 0;

        ocorrencias.forEach(o => {
            if (!o.latitude || !o.longitude) return;

            const tipo  = icones[o.idTipo] || { label: 'Outro' };
            const data  = o.dataOcorrencia
                ? new Date(o.dataOcorrencia).toLocaleDateString('pt-BR')
                : 'Data não informada';

            const m = L.marker([o.latitude, o.longitude], { icon: criarIcone(o.idTipo) })
                .bindPopup(`
                    <strong>${o.titulo || 'Sem título'}</strong><br>
                    <span style="color:#666">${tipo.label}</span><br>
                    ${o.descricao || ''}<br>
                    <small>📅 ${data}</small>
                `)
                .addTo(mapa);

            marcadoresOcorrencias.push(m);
        });

        console.log(`${ocorrencias.length} ocorrência(s) encontrada(s) no raio de 5km`);

    } catch (err) {
        console.log('Erro ao carregar ocorrências próximas:', err);
    }
}

// CHAMA QUANDO O GPS ENCONTRAR A LOCALIZAÇÃO 
// Sobrescreve o evento locationfound para também carregar ocorrências
mapa.on('locationfound', function (e) {
    carregarOcorrenciasProximas(e.latlng.lat, e.latlng.lng);

     carregarOcorrenciasProximas(latitude, longitude);
});