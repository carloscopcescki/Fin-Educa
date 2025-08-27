function calcularJurosSimples() {
    var capital = parseFloat(document.getElementById('valorInicialSimples').value);
    var taxaJurosAnual = parseFloat(document.getElementById('taxaJurosSimples').value) / 100;
    var tempoAnos = parseInt(document.getElementById('tempoAnosSimples').value);

    var juros = (capital * taxaJurosAnual) * tempoAnos;

    var total = capital + juros;

    var options = { style: 'currency', currency: 'BRL' };

    document.getElementById('resultadoInvestido').textContent = 'Total Investido: ' + capital.toLocaleString('pt-BR', options);
    document.getElementById('resultadoJurosSimples').textContent = 'Total em Juros: ' + juros.toLocaleString('pt-BR', options);
    document.getElementById('resultadoMontanteSimples').textContent = 'Montante Total: ' + total.toLocaleString('pt-BR', options);
}

function limparCamposSimples() {
    document.getElementById('valorInicialSimples').value = 0;
    document.getElementById('taxaJurosSimples').value = 0;
    document.getElementById('tempoAnosSimples').value = 1;
    document.getElementById('resultadoInvestido').textContent = 'Total Investido: R$ 0.00';
    document.getElementById('resultadoJurosSimples').textContent = 'Total em Juros: R$ 0.00';
    document.getElementById('resultadoMontanteSimples').textContent = 'Montante Total: R$ 0.00';
}