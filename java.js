document.querySelector('#hit').addEventListener('click',blackjackHit);
document.querySelector('#stand').addEventListener('click',dealerLogic);
document.querySelector('#deal').addEventListener('click',blackjackDeal);

let blackjackGame={
    'you': {'scoreSpan':'#your-blackjack-score','div': '#your-box','score':0},
    'dealer': {'scoreSpan':'#dealer-blackjack-score','div': '#dealer-box','score':0},
    'cards': ['2','3','4','5','6','7','8','9','10','j','q','k','a'],
    'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'j':10,'k':10,'q':10,'a':[1,11]},
    'wins':0,
    'loss':0,
    'draw':0,
    'isStand':false,
    'turnsOver':false
};
const You= blackjackGame['you'];
const Dealer= blackjackGame['dealer'];
const Cards= blackjackGame['cards'];
const CardsMap= blackjackGame['cardsMap'];
const hitSound= new Audio('sound/swish.m4a');
const winSound= new Audio('sound/yaay.m4a');
const loseSound= new Audio('sound/aww.m4a');


function blackjackHit(){
    if(blackjackGame['isStand']===false){
    let card= randomCards();
    showCard(You,card);
    updateScore(You,card);
    showScore(You);
    }
}

function randomCards(){
    /*
    let randomCard= Math.floor(Math.random()*13);
    let card= Cards[randomCard];
    console.log(card)
    return card
    */
   let randomIndex = Math.floor(Math.random()*13);
   return Cards[randomIndex];
}

function showCard(activePlayer,card){
    if(activePlayer['score']<=21){
        let cardImage= document.createElement('img');
        //let card=randomCards();
        cardImage.src=`images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal(){
    //showResult(computeWinner());
    /*
    console.log(winner['div']);
    if(winner['div']=="#dealer-box"){
        document.querySelector("#blackjack-result").textContent="You lost";
        document.querySelector("#blackjack-result").style.color="red";
        loseSound.play();
    }
    else if(winner['div']=="#your-box"){
        document.querySelector("#blackjack-result").textContent="You won";
        document.querySelector("#blackjack-result").style.color="green";
        winSound.play();
    }
    else{
        document.querySelector("#blackjack-result").textContent="You drew";
        document.querySelector("#blackjack-result").style.color="yellow";
    }
    */
   if(blackjackGame['turnsOver']===true){
       blackjackGame['isStand']=false;
       
        let yourImages= document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages= document.querySelector('#dealer-box').querySelectorAll('img');
        for(let i=0;i<yourImages.length;i++){
            yourImages[i].remove();
        }
        for(let i=0;i<dealerImages.length;i++){
            dealerImages[i].remove();
        }
        You['score']=0;
        Dealer['score']=0;
        document.querySelector(You['scoreSpan']).textContent="0";
        document.querySelector(You['scoreSpan']).style.color="white";
        document.querySelector(Dealer['scoreSpan']).textContent="0";
        document.querySelector(Dealer['scoreSpan']).style.color="white";
        document.querySelector('#blackjack-result').textContent="Let's Play";
        document.querySelector('#blackjack-result').style.color="black";
        blackjackGame['turnsOver']=false;
    }
}
function updateScore(activePlayer, card){
    //if adding 11 keeps me below 21 add 11 otherwise add 1
    if(card=='a'){
        console.log('a');
        if(activePlayer['score']+11<=21){
            activePlayer['score'] += 11;
        }
        else{
            activePlayer['score'] += 1;
        }
    }
    else{
        activePlayer['score'] += CardsMap[card];
        console.log(activePlayer['score']);
    }
}

function showScore(activePlayer){
    if(activePlayer['score']<=21){    
        document.querySelector(activePlayer['scoreSpan']).textContent= activePlayer['score'];
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent="Bust!";
        document.querySelector(activePlayer['scoreSpan']).style.color="Red";

    }
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}
async function dealerLogic(){
    blackjackGame['isStand'] =true;
    while(Dealer['score']<18 && blackjackGame['isStand']===true){
        let card =randomCards();
        showCard(Dealer,card);
        updateScore(Dealer,card);
        showScore(Dealer);
        await sleep(1000);
    }
    blackjackGame['turnsOver']=true;
    let winner= computeWinner();
    showResult(winner);

}

//compute winner and determine who just won
//update wins,draws and losses
function computeWinner(){
    console.log("your score is",You['score']);
    console.log("dealer score is",Dealer['score']);
    let winner;
    if (You['score']<=21){
        //condition higher score than the dealer or if dealer busts and you dont
        if (You['score']>Dealer['score'] || Dealer['score']>21){
            blackjackGame['wins']++;
            console.log("You won");
            winner=You;
        }
        else if(You['score']<Dealer['score']){
            blackjackGame['loss']++;
            console.log("You lost");
            winner= Dealer;
        }
        else if(You['score'] === Dealer['score']){
            blackjackGame['draw']++;
            console.log("Draw");
        }
        }
    // condition when user busts but dealer doesnt
    else if (You['score']>21 && Dealer['score']<=21){
        blackjackGame['loss']++;
        console.log("You lost");
        winner= Dealer;
    }
    //condition when you and the dealer bust
    else if(You['score']>=21 && Dealer['score']>=21){
        blackjackGame['draw']++;
        console.log("You drew");
    }
    console.log(winner);
    return winner;
    }
function showResult(winner){
    let message, messageColor;
    if(blackjackGame['turnsOver']===true){
        if(winner===You){
            document.querySelector("#wins").textContent=blackjackGame['wins']++;      
            message="You Won";
            messageColor="green";
            winSound.play();
        }
        else if(winner===Dealer){
            document.querySelector("#losses").textContent= blackjackGame['loss']++;
            message="You Lost";
            messageColor="red";
            loseSound.play();
        }
        else{
            document.querySelector("#draws").textContent= blackjackGame['draw']++;
            message="You Drew";
            messageColor="black";
        }
        document.querySelector("#blackjack-result").textContent=message;
        document.querySelector("#blackjack-result").style.color=messageColor;
    }
}