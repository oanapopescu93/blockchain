export const formatDate = (date, format = 'd.m.Y H:i')=>{	//d.m.Y H:i, d-m-Y H:i, m/d/Y H:i, d-m-Y h:i A, m/d/Y h:i A
    let d = new Date(parseInt(date))
    const pad = (num) => (num < 10 ? '0' : '') + num // Helper function to pad numbers with leading zeros
  
    const yyyy = d.getFullYear()
    const MM = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const HH24 = pad(d.getHours())
    const hh12 = pad((d.getHours() % 12) || 12) // Convert to 12-hour format
    const mm = pad(d.getMinutes())
    const ss = pad(d.getSeconds())
    const ampm = d.getHours() < 12 ? 'AM' : 'PM'
  
    let formattedDate = format
      .replace('d', dd)
      .replace('m', MM)
      .replace('Y', yyyy)
      .replace('H', HH24)
      .replace('i', mm)
      .replace('s', ss)
      .replace('h', hh12)
      .replace('A', ampm)
  
    return formattedDate
}