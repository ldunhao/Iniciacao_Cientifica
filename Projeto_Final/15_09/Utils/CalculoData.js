function CalculoData(tInicial, tHiperplano) {
    const diffTime = Math.abs(tHiperplano - tInicial);

    let milliseconds = Math.floor((diffTime % 1000) / 100)
    let seconds = Math.floor((diffTime / 1000) % 60)
    let minutes = Math.floor((diffTime / (1000 * 60)) % 60)
    let hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24)

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

module.exports = {
    CalculoData
}