function FormatData(date) {
    const finalDate = new Date(date);
    const shortDate = `${finalDate.toLocaleDateString()}`

    const hour = finalDate.getHours() < 10 ? '0'.concat(finalDate.getHours()) : finalDate.getHours()
    const minutes = finalDate.getMinutes() < 10 ? '0'.concat(finalDate.getMinutes()) : finalDate.getMinutes()
    const seconds = finalDate.getSeconds() < 10 ? '0'.concat(finalDate.getSeconds()) : finalDate.getSeconds()
    const hourDate = `${hour}:${minutes}:${seconds}`
    
    return `${shortDate} ${hourDate}`;
}

module.exports = {
    FormatData
}