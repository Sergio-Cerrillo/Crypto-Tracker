import { useEffect, useState } from "react"
import  Axios  from "axios";

function App() {
  const[cryptoData, setCryptoData]=useState({});
  const[loading, setLoading]=useState(true);

  useEffect(()=>{
    const checkCryptoPrices=async()=>{
      try{
        //get crypto
        const respData = await Axios.get('https://api.coingecko.com/api/v3/coins/list')

        //only firs 20
        const dataIds = (respData).data.map(coin=>coin.id).slice(0,20);

        //price of my first 20 coins
        const respDataPrice = await Axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${dataIds.join(',')}&vs_currencies=usd`);
        
        //update state of prices
        setCryptoData(respDataPrice.data);
        setLoading(false)
      }catch (error){
        console.error("Error on feching data: ", error);
        setLoading(false)
      }
    }
  checkCryptoPrices();

  //update prices 1time/min
  const interval=setInterval(checkCryptoPrices,60000);

  //clear interval
  return()=>clearInterval(interval);
  
  },[])

  return (
      <div>
        <h1 className='title'>Crypto-Price</h1>
        {loading?(
          <h2 className='loading'>Loading prices...</h2>
        ):(
          <div className='container-list'>
          <ul className='coin-list'>
            {Object.keys(cryptoData).map(coin=>(
              <li className='coin' key={coin}>
                <span className='coin-name'>{coin}</span>
                <span className='coin-price'>- ${cryptoData[coin].usd}</span> 
              </li>
                ))}
          </ul>
          </div>

        )}


      </div>
  )
}

export default App
