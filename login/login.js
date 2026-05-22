const API_URL = "http://localhost:8080/api";

// formata CPF enquanto digita
document.getElementById("cpf").addEventListener("input", function () {
let v = this.value.replace(/\D/g, "").slice(0, 11);
if (v.length > 9)
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    this.value = v;
});

async function fazerLogin() {
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

erro.style.display = "none";

if (!cpf || !senha) {
    erro.textContent = "Preencha todos os campos!";
    erro.style.display = "block";
    return;
}

try {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
    });

    const data = await response.json();

    if (data.sucesso) {
        localStorage.setItem("tipo", data.tipo);
      window.location.href = "../usuario.html"; // ← todos vão para usuario.html
    } else {
        erro.textContent = data.mensagem || "CPF ou senha incorretos!";
        erro.style.display = "block";
    }
} catch (error) {
    erro.textContent = "Erro ao conectar com o servidor!";
    erro.style.display = "block";
    }
}
