
import { useState ,useEffect } from 'react';
import Overlay from './Overlay'
import './board.css'
import Tile from './Tile'

 const Board =() =>{

    const shuffle = () =>
        new Array (16)
        .fill()
        .map((_,i) =>i+1)
        .sort (()=> Math.random() -.5)
        .map((x,i) => ({value : x , index : i}))
        console.log(shuffle);

        const [numbers,setNumbers] =useState([])
        const [animating,setAnimating] = useState(false)

    const reset = () => setNumbers(shuffle())

    const moveTile = tile => {
        const i16 = numbers.find(n => n.value==16).index
        if (![i16-1,i16+1,i16-4,i16+4].includes(tile.index) || animating)
            return
        
        const newNumbers = 
            [...numbers]
            .map(number => {
                if (number.index !== i16 && number.index !== tile.index)
                    return number
                else if (number.value == 16)
                    return {value: 16, index: tile.index}

                return {value: tile.value, index : i16}
            })
        setAnimating(true)
        setNumbers(newNumbers)
        setTimeout(() => setAnimating(false), 200)
    }

    const handleKeyDown = e => {
        const i16 = numbers.find(n => n.value==16).index
        if (e.keyCode == 37 && !(i16 % 4 == 3))
            moveTile(numbers.find(n => n.index == i16 + 1))
        else if (e.keyCode == 38 && !(i16 > 11))
            moveTile(numbers.find(n => n.index == i16 + 4))
        else if (e.keyCode == 39 && !(i16 % 4 == 0))
            moveTile(numbers.find(n => n.index == i16 - 1))
        else if (e.keyCode == 40 && !(i16 < 4))
            moveTile(numbers.find(n => n.index == i16 - 4))
    }

    useEffect(() => {
        document.addEventListener('keydown',handleKeyDown)
        return () => {document.removeEventListener('keydown',handleKeyDown)}
    })

    useEffect(reset, [])

    const NewGame = ({reset}) =>
    <div className='btn-wrapper'>
        <button onClick={reset}>New Game</button>
    </div>

const Winner = ({numbers,reset}) => {
    if (!numbers.every(n => n.value === n.index +1))    
        return null

    return <div 
        className="winner">
        <p>You win!</p>
        <NewGame reset={reset} />
    </div>
}

    
  return (
    <div className='game'>
       <div className='board'>
          <Overlay  size={16} />
            {numbers.map ((x,i) => {
                return <Tile key={i} number={x} moveTile={moveTile}/>
            })}
      </div>
        <Winner numbers={numbers} reset={reset}/>
        <NewGame reset={reset} />
    </div>
  )
}

export default Board


