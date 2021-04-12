//call the main line of execution for your program only when the DOM has completely loaded
document.addEventListener('DOMContentLoaded', main);

//CREATE PLAYERS and variables that could store total and hands
let players= [{name:'computer',hands:new Array(),total:0},{name:'user',hands:new Array(),total:0}];
class Card {
    constructor(Value,Suit) {
      this.Suit= Suit;
      this.Value = Value;
    }
  }
const suits = ["♠", "♣","♦", "♥"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

//where your game code resides 
function main(){
    let playButton = document.querySelector('.playBtn');
    playButton.addEventListener('click',handleClick); //click event listener for your submit button
}

function handleClick(evt){
    const start = document.querySelector('.start');
    start.style.display = 'none'; //hide
    const startVals = document.querySelector('#startValues').value.split(','); //value property 
    // console.log(start);
    //console.log(startVals); when no input = > [""]
    //console.log(this); // this refers to play button 
    evt.preventDefault();//stop the form from submitting
    playGame(startVals);
}


function playGame(startVals){
    //FIRST , Generate a deck of 52 shuffled cards -arr
    let deck = new Array();
    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            let card = { Value: values[x], Suit: suits[i] };
            //3: {Value: "8", Suit: "D"}
            deck.push(card);
        }
    }
    //SECOND, shuffle cards
    // reference : https://www.programiz.com/javascript/examples/shuffle-card
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    
    //USE starting values from input and place them in the front of deck
    if (startVals[0]!==""){
        startVals=startVals.reverse();
        for(let val of startVals){
            deck.unshift({Value:val,Suit:'♥'}); //any suit
        }
    }


    //DEAL THE CARDS- alternate between the computer and player
    //the computer gets 1,3 & the player gets 2,4
    for (let i=0;i<4;i++){
        i%2===1? players[1].hands.push(deck[0]):players[0].hands.push(deck[0]);
        deck.shift();
    }
    console.log(deck);

    
    totalUpdate();
    console.log(players);
    //Display the Cards and USER INTERFACE
    const game= document.querySelector('.game');


    // Create two elements to display the computer and user total
    // the computer total should be displayed as ?
    // the user total should reflect the total in the user's hand
    const computerDiv=document.createElement('div');
    computerDiv.setAttribute('class','outputBlock');
    computerDiv.setAttribute('id','computerBlock');
    const computerScore=document.createElement('h2');
    computerScore.innerHTML='Computer Hand - Total: ?';
    computerScore.setAttribute('class','computerScore');
    const computerCards=document.createElement('div');
    computerCards.setAttribute('id','computerCards');
    computerDiv.appendChild(computerScore);
    computerDiv.appendChild(computerCards);
    game.appendChild(computerDiv);


    const userDiv=document.createElement('div');
    userDiv.setAttribute('class','outputBlock');
    userDiv.setAttribute('id','userBlock');
    const userScore=document.createElement('h2');
    userScore.innerHTML='Your Hand - Total: ' + String(players[1].total);
    userScore.setAttribute('class','userScore');
    const userCards=document.createElement('div');
    userCards.setAttribute('id','userCards');
    userDiv.appendChild(userScore);
    userDiv.appendChild(userCards);
    game.appendChild(userDiv);
     
    //create buttons
    const hit=document.createElement('button');
    hit.setAttribute('class','hitBtn');
    hit.setAttribute('type','submit');
    hit.setAttribute('value','Hit');
    hit.textContent='Hit';
    game.appendChild(hit); 

    const stand=document.createElement('button');
    stand.setAttribute('type','submit');
    stand.setAttribute('value','Stand');
    stand.setAttribute('class','standBtn');
    stand.textContent='Stand';
    game.appendChild(stand); 

    //const cc1= new Card(players[0].hands[0].Value,players[0].hands[0].Suit);
    const cc2=new Card(players[0].hands[1].Value,players[0].hands[1].Suit);
    const uc1=new Card(players[1].hands[0].Value,players[1].hands[0].Suit);
    const uc2=new Card(players[1].hands[1].Value,players[1].hands[1].Suit);

    c1img=document.createElement('img');
    c1img.src= "../public/img/back.jpg";
    c1img.classList.add('card');
    c1img.setAttribute('width','3cm');
    c1img.setAttribute('height','4.5cm');
    document.querySelector('#computerCards').appendChild(c1img);
    //addCard(0,cc1);
    addCard(0,cc2);
    addCard(1,uc1);
    addCard(1,uc2);
    
    //ADD event listeners to HIT AND STAND 
    hit.addEventListener('click',function(evt){
        let newCardinfo=deck.shift(); //deal the next card from the deck
        console.log(newCardinfo);
        let newCard=new Card(newCardinfo.Value,newCardinfo.Suit);
        console.log(newCard);
        players[1].hands.push(newCardinfo);
        totalUpdate();
        userScore.innerHTML='Your Hand - Total: ' + String(players[1].total);
        addCard(1,newCard); //an element should be created to add the card to the user's hand in the user interface
    
        if (players[1].total >21){
            //hitting makes a user's total go over 21, then user's turn ends immediately
            result(0);
        }
        else if (players[1].total===21){
            result(1);
        }
        evt.preventDefault();
    });

    //the computer's strategy is your discretion
    //pressing Stand should end the user's turn and allow the computer to Hit or Stand
    //an easy strategy is to always hit if a hand total is underneath a threshold=20, but stand if it's eqaul to or above that threshold
    stand.addEventListener('click',function(evt){
        while(players[0].total<20){
            let newCardinfo=deck.shift(); //deal the next card from the deck
            console.log(newCardinfo);
            let newCard=new Card(newCardinfo.Value,newCardinfo.Suit);
            console.log(newCard);
            players[0].hands.push(newCardinfo);
            totalUpdate();
            addCard(0,newCard);
        }
        if (players[0].total===20){
            if (players[0].total<players[1].total){
                result(1);
            }
            else if (players[0].total===players[1].total){
                result(2);
            }else{
                result(0);
            }
        }
        if(players[0].total>players[1].total && players[0].total ===21){
            result(0);
        }
        else if(players[0].total>players[1].total && players[0].total > 21){
            result(1);
        }
        else if(players[0].total===players[1].total){
            result(2);
        }
    });
    game.appendChild(hit);
    game.appendChild(stand);
    
    //restart button 
    const restart=document.createElement('button');
    restart.setAttribute('type','submit');
    restart.setAttribute('value','Restart');
    restart.setAttribute('class','restartBtn');
    restart.textContent='Restart';
    restart.style.display = 'none';
    restart.addEventListener('click', function(evt){
        window.location.reload();
    }); 
    game.appendChild(restart);
    

}
function result(winner){
    document.getElementsByClassName('computerScore')[0].innerHTML='Computer Hand- Total:'+ String(players[0].total);
    document.getElementById("computerCards").innerHTML='' //time to show real result
    for (let realc of players[0].hands){
        //{Value: "2", Suit: "♥"}
        console.log(realc);
        let realcard=new Card(realc.Value,realc.Suit);
        console.log(realcard);
        addCard(0,realcard);
    }
    const game= document.querySelector('.game');
    document.querySelector('.hitBtn').style.display = "none";
    document.querySelector('.standBtn').style.display = "none";
    const winnerMsg = document.createElement('div');
    winnerMsg.setAttribute('class','finalResult');
    if (winner===1){
        winnerMsg.innerHTML = 'Player Won 💰💰💰';
        game.appendChild(winnerMsg);
    }
    else if (winner===0){
        winnerMsg.innerHTML = 'Player Lost 😩😩😩';
        game.appendChild(winnerMsg);
    }
    else {
        winnerMsg.innerHTML = 'Tie 🙈🙈🙈';
        game.appendChild(winnerMsg);
    }
    document.querySelector('.restartBtn').style.display = 'block';
}

//mostly display purposes 
function addCard(who, card){
    const added= document.createElement('div');
    added.classList.add('card');
    const top=document.createElement('div');
    top.classList.add('labelTop');
    top.appendChild(document.createTextNode(card.Value+ card.Suit));

    const bottom = document.createElement('div');
    bottom.classList.add('labelBottom');
    bottom.appendChild(document.createTextNode(card.Value+ card.Suit));

    added.appendChild(top);
    added.appendChild(bottom);
    if (card.Suit==="♥" || card.Suit==="♦" ){
        bottom.classList.add('red');
        top.classList.add('red');
    } else{
        bottom.classList.add('black');
        top.classList.add('black');
    }
    //whom to add
    who===0? document.querySelector('#computerCards').appendChild(added):document.querySelector('#userCards').appendChild(added);
}

//Calculate the hand total for whether the comp or the player
function totalUpdate(){
    for (let u=0;u<players.length;u++){
        let total = 0;
        let numA = 0;
        for (let i=0;i<players[u].hands.length;i++){
            const cur=players[u].hands[i];
            if (cur.Value=== "J"|| cur.Value=== "Q"|| cur.Value==="K"){
                total+=10;
            }
            else if (cur.Value==="A"){
                numA+=1;
            }
            else{
                total+=parseInt(cur.Value,10);
            }
        }
        //For calculating the value for A 
        for (let a=0;a<numA;a++){
            total+11<=21?total+=11: total+=1;
        }
        players[u].total=total;
    }
}


