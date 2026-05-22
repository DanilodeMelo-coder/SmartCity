HEAD
// --- Modal de Login ---
const modalOverlay = document.getElementById('modal_overlay');
const btnLogin = document.getElementById('btn_login');
const modalFechar = document.getElementById('modal_fechar');

const API_URL = 'http://localhost:8080/api';

document.getElementById('modal_btn_entrar').addEventListener('click', async () => {
      const email = document.querySelector('#modal_login input[type="text"]').value;
      const senha = document.querySelector('#modal_login input[type="password"]').value;

      if (!email || !senha) {
            alert('Preencha email e senha!');
            return;
      }

try {
      const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: email, senha })
            });

            const data = await response.json();

      if (data.sucesso) {
            localStorage.setItem('tipo', data.tipo);
            modalOverlay.classList.remove('aberto');

            if (data.tipo === 'ADMIN') {
                // já está na página certa, só fecha o modal
                  alert('Bem-vindo, Admin!');
            } else {
                  window.location.href = '../cidadao/cidadao.html';
            }
            } else {
            alert('CPF/Email ou senha incorretos!');
            }

      } catch (error) {
            alert('Erro ao conectar com o servidor!');
      }
});

document.getElementById('btn_registrar_ocorrencia').addEventListener('click', async () => {
      const tipo     = document.getElementById('tipo_incidente').value;
      const regiao   = document.getElementById('regiao').value;
      const descricao = document.querySelector('#modal_ocorrencia textarea').value;
      const prioridade = document.querySelector('.prioridade_btn.ativo')?.textContent || 'Média';

if (!tipo || !regiao || !descricao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
}

    // mapeia prioridade para idGravidade
const gravidades = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };

try {
      const response = await fetch(`${API_URL}/ocorrencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            titulo: tipo,
            descricao,
            idTipo: 1,
            idGravidade: gravidades[prioridade] || 2,
            idBairro: 1,
            idUsuarioCriador: 1,
            latitude: -23.5505,
            longitude: -46.6333
            })
      });

      const data = await response.json();

      if (data.sucesso) {
            alert('Ocorrência registrada com sucesso!');
            modalOcorrenciaOverlay.classList.remove('aberto');
      } else {
            alert('Erro ao registrar ocorrência!');
      }

} catch (error) {
      alert('Erro ao conectar com o servidor!');
}
});

// Abre o modal de login ao clicar no botão de login do topo
if (btnLogin) {
      btnLogin.addEventListener('click', () => {
            modalOverlay.classList.add('aberto');
      });
}

// Fecha o modal de login no botão "X"
if (modalFechar) {
      modalFechar.addEventListener('click', () => {
            modalOverlay.classList.remove('aberto');
      });
}

// --- Modal de Nova Ocorrência ---
const modalOcorrenciaOverlay = document.getElementById('modal_ocorrencia_overlay');
const btnOcorrencia = document.getElementById('btn_ocorrencia');
const btnFecharOcorrencia = document.getElementById('modal_ocorrencia_fechar');
const btnCancelarOcorrencia = document.getElementById('btn_cancelar_ocorrencia');

// Abre o modal de ocorrência
if (btnOcorrencia) {
      btnOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.add('aberto');
      });
}


// Fecha o modal de ocorrência (botão Cancelar)
if (btnCancelarOcorrencia) {
      btnCancelarOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.remove('aberto');
      });
}


// --- Lógica de Prioridade (Botões dentro do modal) ---
const prioridadeBtns = document.querySelectorAll('.prioridade_btn');

prioridadeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            // Remove as classes de ativação de todos os botões
            prioridadeBtns.forEach(b => b.classList.remove('ativo', 'active_media'));
            
            // Adiciona a classe 'ativo' apenas no que foi clicado
            btn.classList.add('ativo');
      });
});

// --- Simulação de preenchimento dos Cards --- 
document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('total_ocorrencias').textContent = '---';
      document.getElementById('variacao_total').textContent = '---';
      document.getElementById('variacao_total').style.color = '#f85149'; // Vermelho (ruim se subir)

      document.getElementById('tempo_resposta').textContent = '---';
      document.getElementById('variacao_tempo').textContent = '---';
      document.getElementById('variacao_tempo').style.color = '#3ecf8e'; // Verde (bom se baixar)

      document.getElementById('regioes').textContent = '---';
      document.getElementById('variacao_regioes').textContent = '---';
      document.getElementById('variacao_regioes').style.color = '#8892b0';

      document.getElementById('taxa_resolucao').textContent = '---';
      document.getElementById('variacao_taxa').textContent = '---';
      document.getElementById('variacao_taxa').style.color = '#3ecf8e';
});

// 1. Inicializa o mapa sem passar coordenadas fixas no início
const mapa = L.map('mapa');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Raio máximo de visualização
const RAIO_MAXIMO_METROS = 2000;

// setView: true faz o mapa iniciar e focar direto onde o usuário está
// maxZoom: 15 define a aproximação inicial do mapa ao encontrar o usuário
mapa.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });

// Evento executado assim que a localização é encontrada
mapa.on('locationfound', (e) => {
      const localizacaoUsuario = e.latlng;

    // Ponto onde esta o usuario
      L.marker(localizacaoUsuario)
            .addTo(mapa)
            .bindPopup("<b>Você está aqui</b>")
      .openPopup();

    // Desenha o círculo do raio ao redor do usuário
      L.circle(localizacaoUsuario, {
            color: '#00d4ff',
            fillColor: '#00d4ff',
            fillOpacity: 0.15,
            radius: RAIO_MAXIMO_METROS
      }).addTo(mapa);
});

// Caso o usuário negue a permissão ou o GPS falhe
mapa.on('locationerror', (e) => {
      console.log("Geolocalização negada ou indisponível. Usando posição padrão.");

    // Posição no centro de SP caso ele não mude ou negue o GPS
      const posicaoPadrao = [-23.5505, -46.6333];
      mapa.setView(posicaoPadrao, 12);
});

// --- Modal de Login ---
const modalOverlay = document.getElementById('modal_overlay');
const btnLogin = document.getElementById('btn_login');
const modalFechar = document.getElementById('modal_fechar');

// Abre o modal de login ao clicar no botão de login do topo
if (btnLogin) {
      btnLogin.addEventListener('click', () => {
            modalOverlay.classList.add('aberto');
      });
}

// Fecha o modal de login no botão "X"
if (modalFechar) {
      modalFechar.addEventListener('click', () => {
            modalOverlay.classList.remove('aberto');
      });
}

// --- Modal de Nova Ocorrência ---
const modalOcorrenciaOverlay = document.getElementById('modal_ocorrencia_overlay');
const btnOcorrencia = document.getElementById('btn_ocorrencia');
const btnFecharOcorrencia = document.getElementById('modal_ocorrencia_fechar');
const btnCancelarOcorrencia = document.getElementById('btn_cancelar_ocorrencia');

// Abre o modal de ocorrência
if (btnOcorrencia) {
      btnOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.add('aberto');
      });
}


// Fecha o modal de ocorrência (botão Cancelar)
if (btnCancelarOcorrencia) {
      btnCancelarOcorrencia.addEventListener('click', () => {
            modalOcorrenciaOverlay.classList.remove('aberto');
      });
}


// --- Lógica de Prioridade (Botões dentro do modal) ---
const prioridadeBtns = document.querySelectorAll('.prioridade_btn');

prioridadeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            // Remove as classes de ativação de todos os botões
            prioridadeBtns.forEach(b => b.classList.remove('ativo', 'active_media'));
            
            // Adiciona a classe 'ativo' apenas no que foi clicado
            btn.classList.add('ativo');
      });
});

// --- Simulação de preenchimento dos Cards --- 
document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('total_ocorrencias').textContent = '---';
      document.getElementById('variacao_total').textContent = '---';
      document.getElementById('variacao_total').style.color = '#f85149'; // Vermelho (ruim se subir)

      document.getElementById('tempo_resposta').textContent = '---';
      document.getElementById('variacao_tempo').textContent = '---';
      document.getElementById('variacao_tempo').style.color = '#3ecf8e'; // Verde (bom se baixar)

      document.getElementById('regioes').textContent = '---';
      document.getElementById('variacao_regioes').textContent = '---';
      document.getElementById('variacao_regioes').style.color = '#8892b0';

      document.getElementById('taxa_resolucao').textContent = '---';
      document.getElementById('variacao_taxa').textContent = '---';
      document.getElementById('variacao_taxa').style.color = '#3ecf8e';
});

// Inicializa o mapa focado em São Paulo
// O 'mapa' entre parênteses deve ser o mesmo ID da div no HTML
const mapa = L.map('mapa').setView([-23.5505, -46.6333], 12);

// Adiciona a camada de visualização (os desenhos das ruas)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
}).addTo(mapa);
c1f9e385d6bd3ad206552e0a91dc7cbd0043a9d4
