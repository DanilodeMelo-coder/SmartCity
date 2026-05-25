// Abre o mapa do LEAFLET e já define uma visão inicial (Centro de SP)
const mapa = L.map('mapa').setView([-23.5505, -46.6333], 13);

// Cria um grupo separado para gerenciar os marcadores de ocorrência dinamicamente, colocar os pininhos das ocorrencias que puxar do banco
const grupoMarcadores = L.layerGroup().addTo(mapa);

// Constante para receber o marcador do usuário e o círculo do raio azul
const camadaUsuario = L.layerGroup().addTo(mapa);

// Carrega os desenhos das ruas do OpenStreetMap(L.titleLayer que faz isso)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Configurações de Geolocalização e limites
const RAIO_MAXIMO_METROS = 3000; // limitei aqui em 3km
let localizacaoUsuario = null;    //localização do usuario começa vazia
let primeiroCarregamento = true; //centralizar a camera na primeira vez que a pessoa entrar

//  permissões e gps
function gerenciarPermissaoGPS() {
    // Verifica se o navegador suporta a API de permissões nativa
    if (!navigator.permissions) {
        ativarRastreamentoFisico();
        return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') {
            console.log("Permissão de localização já concedida.");
            ativarRastreamentoFisico();
        } else if (status.state === 'prompt') {
            console.log("Solicitando permissão ao usuário via navegador...");
            ativarRastreamentoFisico();
        } else if (status.state === 'denied') {
            alert("O acesso à localização está bloqueado no seu navegador. Para visualizar as ocorrências num raio de 3km, ative a permissão de GPS nas configurações da página.");
            carregarPosicaoContingencia();
        }

        // Caso o usuário mude a permissão nas configurações com a página aberta
        status.onchange = () => {
            if (status.state === 'granted') {
                primeiroCarregamento = true;
                ativarRastreamentoFisico();
            }
        };
    });
}

// Ativa o monitoramento em tempo real (Watch)
function ativarRastreamentoFisico() {
    mapa.locate({ 
        watch: true, 
        setView: false, // Controlado manualmente para não travar a tela do usuário para que não fique andando a camera também
        enableHighAccuracy: true 
    });
}

// Posição caso de algum erro ou a pessoa negue sem querer ou propositalmente, localização no centro de São Paulo
function carregarPosicaoContingencia() {
    localizacaoUsuario = L.latLng([-23.5505, -46.6333]); // Centro de SP
    mapa.setView(localizacaoUsuario, 14);
    buscarOcorrenciasDaAPI();
}

// Puxa a loc em tempo real
mapa.on('locationfound', (e) => {
    localizacaoUsuario = e.latlng;

    // Limpa os elementos visuais antigos do usuário (marcador e círculo)
    camadaUsuario.clearLayers();

    // Adiciona o ponto de onde a pessoa está
    const marcadorUsuario = L.marker(localizacaoUsuario)
        .bindPopup("<b>Sua localização atual</b>");
    camadaUsuario.addLayer(marcadorUsuario);

    // Desenha o circulo azul em volta do ponto que a pessoa esta, no caso os 3km
    const circuloRaio = L.circle(localizacaoUsuario, {
        color: '#00d4ff',
        fillColor: '#00d4ff',
        fillOpacity: 0.12,
        radius: RAIO_MAXIMO_METROS
    });
    camadaUsuario.addLayer(circuloRaio);

    // Centraliza a câmera no usuário quando entrar na pagina
    if (primeiroCarregamento) {
        mapa.setView(localizacaoUsuario, 14);
        marcadorUsuario.openPopup();
        primeiroCarregamento = false;
    }

    // Atualiza a listagem de marcadores vindos do banco
    buscarOcorrenciasDaAPI();
});

// Tratamento caso a tentativa de ler o sinal do GPS falhe após o prompt
mapa.on('locationerror', (e) => {
    console.log("Erro ao obter a geolocalização exata. Carregando ponto padrão.");
    if (!localizacaoUsuario) {
        carregarPosicaoContingencia();
    }
});

//  INTEGRAÇÃO COM A API JAVA SPRING BOOT(não usar ainda)
async function buscarOcorrenciasDaAPI() {
    if (!localizacaoUsuario) return;

    const URL_API = 'http://localhost:8080/api/ocorrencias';

    try {
        const resposta = await fetch(URL_API);
        const listaOcorrenciasReal = await resposta.json();

        // Limpa os pinos de incidentes antigos antes de filtrar novamente
        grupoMarcadores.clearLayers();


        listaOcorrenciasReal.forEach(ocorrencia => {
            // Monta as coordenadas com base na latitude e longitude retornadas do banco MySQL
            const coordsOcorrencia = L.latLng([ocorrencia.latitude, ocorrencia.longitude]);
            
            // Calcula a distância métrica do usuário até o ponto do incidente
            const distancia = localizacaoUsuario.distanceTo(coordsOcorrencia);
            
            // Validação das regras de negócio combinadas
            const estaNoRaio = distancia <= RAIO_MAXIMO_METROS;
            const bairroSelecionado = document.getElementById('filtro_bairro').value;
            const bateOBairro = bairroSelecionado === 'todos' || ocorrencia.idBairro == bairroSelecionado;

            // Insere o marcador se obedecer a todos os filtros e ao raio de 3km
            if (estaNoRaio && bateOBairro) {
        const novoMarcador = L.marker(coordsOcorrencia)
            .bindPopup(`<b>${ocorrencia.titulo}</b><br>${ocorrencia.descricao}<br>Distância: ${(distancia / 1000).toFixed(2)} km`);
        grupoMarcadores.addLayer(novoMarcador);
            }
        });

    } catch (erro) {
        console.error("Falha ao comunicar com a API Spring Boot:", erro);
    }
}


// --- INICIALIZAÇÃO DO COMPONENTE ---
document.addEventListener('DOMContentLoaded', () => {
      // Carrega os dados puxar aqui os dado banco

      document.getElementById('filtro_bairro').addEventListener('change', buscarOcorrenciasDaAPI);

      fetch('http://localhost:8080/api/dashboard/bairro-mais-ocorrencias')
    .then(r => r.json())
    .then(data => {
        document.getElementById('total_ocorrencias').textContent = data.bairro;
    });

      document.getElementById('variacao_total').textContent = '';


      // Dispara o fluxo de verificação de geolocalização nativa
      gerenciarPermissaoGPS();
});