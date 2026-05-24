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