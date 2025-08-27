function convertCurrency() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;

    // Taxa de conversão aproximada em 27/05/2024
    const exchangeRates = {
        USD: 0.19, // 1 BRL = 0.19 USD
        EUR: 0.18, // 1 BRL = 0.18 EUR
        BTC: 0.0000028 // 1 BRL = 0,0000028 BTC
    };

    const result = amount * exchangeRates[currency];

    
    document.getElementById('result').innerText = 'Valor convertido: ' + `${currency} ${result.toFixed(2)}`;
}

function limparCurrency() {
    document.getElementById('amount').value = 0;
    document.getElementById('result').textContent = 'Valor convertido: USD 0.00';
}
