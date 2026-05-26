// 1. INICIALIZAÇÃO DO EMAILJS COM A SUA CHAVE PÚBLICA
emailjs.init("KwBMKC2YCCMLLdoNG");

// 2. CAPTURA DOS ELEMENTOS
const btnEnviar = document.getElementById('modal_btn_email');
const inputEmail = document.getElementById('email_recuperacao');

// 3. EVENTO DE CLIQUE
btnEnviar.addEventListener('click', () => {
      const emailDigitado = inputEmail.value.trim();

      if (!emailDigitado) {
            alert("Por favor, digite um e-mail.");
            return;
      }

      btnEnviar.textContent = "Enviando...";
      btnEnviar.disabled = true; 

      const parametros = {
            email_destino: emailDigitado
      };

      // 4. ENVIO COM OS SEUS IDs REAIS
      emailjs.send("service_an4m9lg", "template_5oikr5m", parametros)
            .then(function(resposta) {
                  alert("E-mail de recuperação enviado com sucesso!");
                  
                  btnEnviar.textContent = "Enviar e-mail";
                  btnEnviar.disabled = false;
                  inputEmail.value = "";
            }, function(erro) {
                  alert("Falha ao enviar o e-mail. Olhe o console (F12).");
                  console.error("Erro detalhado do EmailJS:", erro);
                  
                  btnEnviar.textContent = "Enviar e-mail";
                  btnEnviar.disabled = false;
            });
});