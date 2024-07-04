
function convertirMoneda() {
    const tiposCambio = {
        "USD": {"ARS": 250, "EUR": 0.85},
        "EUR": {"USD": 1.18, "ARS": 295},
        "ARS": {"USD": 0.004, "EUR": 0.0034}
    };

    let monedaOrigen = prompt("Seleccione la moneda de origen: \n1. Dólar (USD) \n2. Euro (EUR) \n3. Peso Argentino (ARS)");
    switch(monedaOrigen) {
        case "1":
            monedaOrigen = "USD";
            break;
        case "2":
            monedaOrigen = "EUR";
            break;
        case "3":
            monedaOrigen = "ARS";
            break;
        default:
            alert("Opción no válida. Por favor seleccione 1, 2 o 3.");
            return;
    }

    let monedaDestino = prompt("Seleccione la moneda de destino: \n1. Dólar (USD) \n2. Euro (EUR) \n3. Peso Argentino (ARS)");
    switch(monedaDestino) {
        case "1":
            monedaDestino = "USD";
            break;
        case "2":
            monedaDestino = "EUR";
            break;
        case "3":
            monedaDestino = "ARS";
            break;
        default:
            alert("Opción no válida. Por favor seleccione 1, 2 o 3.");
            return;
    }

    if (monedaOrigen === monedaDestino) {
        alert("Las monedas de origen y destino no pueden ser iguales.");
        return;
    }

    let cantidad;
    while (true) {
        cantidad = prompt(`Ingrese la cantidad de ${monedaOrigen} a convertir:`);
        if (cantidad === null) {
            return;
        }
        cantidad = parseFloat(cantidad);

        if (!isNaN(cantidad)) {
            break;
        } else {
            alert("Por favor, ingrese un valor numérico válido.");
        }
    }

    let tipoCambio = tiposCambio[monedaOrigen][monedaDestino];

    let resultado = cantidad * tipoCambio;
    alert(`${cantidad} ${monedaOrigen} son ${resultado.toFixed(2)} ${monedaDestino}.`);
}

convertirMoneda();