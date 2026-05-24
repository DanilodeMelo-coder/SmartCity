const API_URL = 'http://localhost:8080';

// formata CPF
document.getElementById('cpf').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    this.value = v;
});

// formata telefone
document.getElementById('telefone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    this.value = v;
});

async function cadastrar() {
    const erro    = document.getElementById('erro');
    const sucesso = document.getElementById('sucesso');
    erro.style.display    = 'none';
    sucesso.style.display = 'none';

    const nome           = document.getElementById('nome').value.trim();
    const cpf            = document.getElementById('cpf').value.trim();
    const telefone       = document.getElementById('telefone').value.trim();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const email          = document.getElementById('email').value.trim();
    const senha          = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

  // validações
    if (!nome || !cpf || !telefone || !dataNascimento || !senha) {
    erro.textContent = 'Preencha todos os campos obrigatórios!';
    erro.style.display = 'block';
    return;
    }

    if (senha.length < 8) {
    erro.textContent = 'A senha deve ter no mínimo 8 caracteres!';
    erro.style.display = 'block';
    return;
    }

    if (senha !== confirmarSenha) {
    erro.textContent = 'As senhas não coincidem!';
    erro.style.display = 'block';
    return;
    }

    try {
    const response = await fetch(`${API_URL}/api/cadastrar-cidadao`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        nome,
        cpf,
        telefone,
        dataNascimento,
        email,
        senha
        })
    });

    if (response.ok) {
        sucesso.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
        sucesso.style.display = 'block';
        setTimeout(() => {
        window.location.href = '../login/login.html';
        }, 2000);
    } else {
        const data = await response.json();
        erro.textContent = data.message || 'Erro ao cadastrar!';
        erro.style.display = 'block';
    }

    } catch (error) {
    erro.textContent = 'Erro ao conectar com o servidor!';
    erro.style.display = 'block';
    }
}