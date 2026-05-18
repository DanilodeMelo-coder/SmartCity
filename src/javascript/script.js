const sidebar = document.getElementById('sidebar');
const openBtn = document.getElementById('open_btn');
const conteudo = document.getElementById('conteudo');

openBtn.addEventListener('click', () => {
      sidebar.classList.toggle('closed');
});

// ─Mapa
const mapa = L.map('mapa').setView([-23.5505, -46.6333], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
}).addTo(mapa);


const sideItems = document.querySelectorAll('.side-item');

const secoes = {
      'Dashboard':   'cards',
      'Mapa':        'secao_mapa',
      'Ocorrências': 'ocorrencias_recentes',
      'Resposta':    'secao_mapa',
      'Relatórios':  'graficos',
      'Atividade':   'graficos',
};

sideItems.forEach(item => {
      item.addEventListener('click', () => {
            sideItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const nome = item.querySelector('.item-description').textContent.trim();
            const idDestino = secoes[nome];
            if (idDestino) {
                  const destino = document.getElementById(idDestino);
                  if (destino) {
                        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
            }
      });
});


const periodoBtns = document.querySelectorAll('.periodo_btn');

periodoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            periodoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
      });
});


const logoutBtn = document.getElementById('logout_btn');

logoutBtn.addEventListener('click', () => {
      logoutBtn.classList.add('clicado');
      setTimeout(() => {
            logoutBtn.classList.remove('clicado');
      }, 200);
});








const modalOverlay = document.getElementById('modal_overlay');

document.getElementById('logout_btn').addEventListener('click', () => {
      modalOverlay.classList.add('aberto');
});

document.getElementById('modal_fechar').addEventListener('click', () => {
      modalOverlay.classList.remove('aberto');
});

modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
            modalOverlay.classList.remove('aberto');
      }
});





const modalOcorrenciaOverlay = document.getElementById('modal_ocorrencia_overlay');
const btnOcorrencia = document.getElementById('btn_ocorrencia');

btnOcorrencia.addEventListener('click', () => {
      modalOcorrenciaOverlay.classList.add('aberto');
});

document.getElementById('modal_ocorrencia_fechar').addEventListener('click', () => {
      modalOcorrenciaOverlay.classList.remove('aberto');
});

document.getElementById('btn_cancelar_ocorrencia').addEventListener('click', () => {
      modalOcorrenciaOverlay.classList.remove('aberto');
});

modalOcorrenciaOverlay.addEventListener('click', (e) => {
      if (e.target === modalOcorrenciaOverlay) {
            modalOcorrenciaOverlay.classList.remove('aberto');
      }
});


const prioridadeBtns = document.querySelectorAll('.prioridade_btn');

prioridadeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            prioridadeBtns.forEach(b => b.classList.remove('ativo', 'active_media'));
            btn.classList.add('ativo');
      });
});