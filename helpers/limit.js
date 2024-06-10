
module.exports = { 
    limit : ( arr , limit ) => {
        if(!Array.isArray(arr)) {return[]} // eger element array deyilse, bos bir array dondurecek
        return arr.slice(0, limit) // eger varsa onda slice funksiyasini 0 ile limit arasinda isletsin 
    }
  }