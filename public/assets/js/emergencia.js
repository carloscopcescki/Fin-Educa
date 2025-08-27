function calcularReserva() {
    var custoFixo = parseFloat(document.getElementById('custoFixo').value);
    var guarda = parseFloat(document.getElementById('guarda').value);
    var salarioMes = parseInt(document.getElementById('salarioMes').value);

    var porcentagemMes = guarda / 100;
    var poupancaMensal = salarioMes * porcentagemMes;
    var reservaEmergencia = 6 * custoFixo;
    var mesesCompletar = reservaEmergencia / poupancaMensal;

    var options = { style: 'currency', currency: 'BRL' };

    document.getElementById('reservaEmergencia').textContent = 'Reserva de emergência: ' + reservaEmergencia.toLocaleString('pt-BR', options);
    document.getElementById('guardando').textContent = 'Guardando: ' + guarda.toFixed(0).replace('.', ',') + '%';
    document.getElementById('mesesCompletar').textContent = 'Meses para completar a reserva: ' + mesesCompletar.toFixed(0).replace('.', ',');
}

function limparCampos() {
    document.getElementById('custoFixo').value = 0;
    document.getElementById('guarda').value = 0;
    document.getElementById('salarioMes').value = 1;
    document.getElementById('reservaEmergencia').textContent = 'Reserva de emergência: R$ 0.00';
    document.getElementById('mesesCompletar').textContent = 'Meses para completar a reserva: ';
    document.getElementById('guardando').textContent = 'Guardando: ';
}