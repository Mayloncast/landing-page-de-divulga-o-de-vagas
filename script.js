// Gerenciamento de vagas usando localStorage
let vagas = JSON.parse(localStorage.getItem('vagasEstagio')) || [];

// Elementos do DOM
const form = document.getElementById('vagaForm');
const vagasBody = document.getElementById('vagasBody');
const emptyState = document.getElementById('emptyState');
const successMessage = document.getElementById('successMessage');
const totalVagasEl = document.getElementById('totalVagas');
const vagasRemotoEl = document.getElementById('vagasRemoto');
const vagasPresencialEl = document.getElementById('vagasPresencial');

// Função para salvar vagas no localStorage
function salvarVagas() {
    localStorage.setItem('vagasEstagio', JSON.stringify(vagas));
}

// Função para formatar bolsa
function formatarBolsa(valor) {
    if (!valor) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// Função para obter badge da modalidade
function getBadgeModalidade(modalidade) {
    const badges = {
        'Remoto': 'badge-remoto',
        'Híbrido': 'badge-hibrido',
        'Presencial': 'badge-presencial'
    };
    const classe = badges[modalidade] || '';
    return `<span class="badge ${classe}">${modalidade}</span>`;
}

// Função para renderizar tabela
function renderizarTabela() {
    vagasBody.innerHTML = '';

    if (vagas.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('vagasTable').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        document.getElementById('vagasTable').style.display = 'table';

        vagas.forEach((vaga, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${vaga.titulo}</strong></td>
                <td>${vaga.empresa}</td>
                <td>${vaga.area}</td>
                <td>${getBadgeModalidade(vaga.modalidade)}</td>
                <td>${formatarBolsa(vaga.bolsa)}</td>
                <td>${vaga.cidade || '-'}</td>
                <td>${vaga.contato}</td>
                <td>
                    <button class="btn-delete" onclick="deletarVaga(${index})">
                        🗑️ Excluir
                    </button>
                </td>
            `;
            vagasBody.appendChild(row);
        });
    }

    // Atualizar estatísticas
    atualizarEstatisticas();
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
    totalVagasEl.textContent = vagas.length;
    vagasRemotoEl.textContent = vagas.filter(v => v.modalidade === 'Remoto').length;
    vagasPresencialEl.textContent = vagas.filter(v => v.modalidade === 'Presencial').length;
}

// Função para deletar vaga
function deletarVaga(index) {
    if (confirm('Tem certeza que deseja excluir esta vaga?')) {
        vagas.splice(index, 1);
        salvarVagas();
        renderizarTabela();
    }
}

// Event listener para submit do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const novaVaga = {
        titulo: document.getElementById('titulo').value,
        empresa: document.getElementById('empresa').value,
        area: document.getElementById('area').value,
        modalidade: document.getElementById('modalidade').value,
        bolsa: document.getElementById('bolsa').value || null,
        cidade: document.getElementById('cidade').value,
        requisitos: document.getElementById('requisitos').value,
        descricao: document.getElementById('descricao').value,
        contato: document.getElementById('contato').value,
        dataCadastro: new Date().toISOString()
    };

    vagas.unshift(novaVaga); // Adiciona no início do array
    salvarVagas();
    renderizarTabela();

    // Mostrar mensagem de sucesso
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);

    // Limpar formulário
    form.reset();
});

// Tornar função deletarVaga global
window.deletarVaga = deletarVaga;

// Renderizar tabela ao carregar
renderizarTabela();
