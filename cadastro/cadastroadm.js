// Verifica se a URL atual possui o parâmetro "?sucesso"
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('sucesso')) {
        // Aguarda 3 segundos (3000 milissegundos) e redireciona
        setTimeout(() => {
            window.location.href = '/login'; // Rota para sua tela de login
        }, 3000);
    }