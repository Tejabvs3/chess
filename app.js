const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const reset = document.querySelector("#reset");
playerDisplay.innerHTML = "white";
const width = 8;


const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard() {
    for(let i=0; i<64; i++) {
        const square = document.createElement("div");
        square.classList.add('square');
        square.innerHTML = startPieces[i];
        const row = Math.floor(i/8);
        if(row%2===0) {
            i%2 === 0 ? square.classList.add("light") : square.classList.add("dark");
        }
        else  {
            i%2 === 0 ? square.classList.add("dark") : square.classList.add("light");
        }
        if(i<16){
            square.firstChild.firstChild.classList.add("black");
            square.firstChild.setAttribute("draggable", "true");
        }
        else if(i>47) {
            square.firstChild.firstChild.classList.add("white");
            square.firstChild.setAttribute("draggable", "true");
        }
        
        obj = {
            x : row,
            y : i%8
        }
        square.id = JSON.stringify(obj);
       
        gameBoard.append(square);
    }

}
createBoard();
if(localStorage.getItem("board")!==null) gameBoard.innerHTML = JSON.parse(localStorage.getItem("board"))
if(localStorage.getItem("player")!==null) playerDisplay.innerHTML = localStorage.getItem("player");
localStorage.setItem("board", JSON.stringify(gameBoard.innerHTML));
reset.addEventListener("click", () => {
    console.log("reset");
    localStorage.removeItem("board");
    localStorage.removeItem("player");
    location.reload();
})

function rookCheck (s, t, u, i) {
    console.log(s,t);
    if(t < s) {
        temp = t;
        t = s;
        s = temp;
    }
    console.log(s,t);
    s++;
    if(i==="x"){
        while (s<t){
            if(document.getElementById(`{"x":${u},"y":${s}}`).firstChild!==null) return false;
            s++;
        }
    }
    else {
        while (s<t){
            if(document.getElementById(`{"x":${s},"y":${u}}`).firstChild!==null) return false;
            s++;
        }
    }
    return true;
}

function bishopCheck (s, t) {
    let x = s.x, y = s.y;
    if(x < t.x && y < t.y) {
        x++; y++;
        while(x<t.x && y<t.y) {
            if(document.getElementById(`{"x":${x},"y":${y}}`).firstChild!==null) return false;
            x++; y++;
        }
    }
    else if(x < t.x && y > t.y) {
        x++; y--;
        while(x<t.x && y>t.y) {
            if(document.getElementById(`{"x":${x},"y":${y}}`).firstChild!==null) return false;
            x++; y--;
        }
    }
    else if(x > t.x && y < t.y) {
        x--; y++;
        while(x>t.x && y<t.y) {
            if(document.getElementById(`{"x":${x},"y":${y}}`).firstChild!==null) return false;
            x--; y++;
        }
    }
    else if(x > t.x && y > t.y) {
        x--; y--;
        while(x>t.x && y>t.y) {
            if(document.getElementById(`{"x":${x},"y":${y}}`).firstChild!==null) return false;
            x--; y--;
        }
    }
    return true;
   
}

function checkValidity(source, target) {
    if(playerDisplay.innerHTML !== source.firstChild.getAttribute("class")) return false;
    const sourcePiece = source.id;
    const SourcePosition = {
        x : JSON.parse(source.parentNode.id).x,
        y : JSON.parse(source.parentNode.id).y
    } 
    //console.log(typeof(SourcePosition.x));
    //console.log(target);
    let targetPosition = {
        x : JSON.parse(target.id).x,
        y : JSON.parse(target.id).y
    }
    //console.log(targetPosition);
    if(target.firstChild!=null && source.firstChild.getAttribute("class")===target.firstChild.firstChild.getAttribute("class")) return false;
    switch(sourcePiece) {
        case "rook":
            if(SourcePosition.x === targetPosition.x) return rookCheck(SourcePosition.y, targetPosition.y, SourcePosition.x,"x");
            else if(SourcePosition.y === targetPosition.y) return rookCheck(SourcePosition.x, targetPosition.x, SourcePosition.y,"y");
            return false;
        case "king":
            if(Math.abs(SourcePosition.x - targetPosition.x) <= 1 && Math.abs(SourcePosition.y - targetPosition.y) <= 1) return true;
            return false;
        case "queen":
            if(SourcePosition.x === targetPosition.x) return rookCheck(SourcePosition.y, targetPosition.y, SourcePosition.x,"x");
            else if(SourcePosition.y === targetPosition.y) return rookCheck(SourcePosition.x, targetPosition.x, SourcePosition.y,"y");
            else if(Math.abs(SourcePosition.x - targetPosition.x) === Math.abs(SourcePosition.y - targetPosition.y)) return bishopCheck(SourcePosition, targetPosition);
            return false;
        case "bishop":
            if(Math.abs(SourcePosition.x - targetPosition.x) === Math.abs(SourcePosition.y - targetPosition.y)) return bishopCheck(SourcePosition, targetPosition);
            return false;
        case "knight":
            if(Math.abs(SourcePosition.x - targetPosition.x) === 2 && Math.abs(SourcePosition.y - targetPosition.y) === 1) return true;
            else if(Math.abs(SourcePosition.x - targetPosition.x) === 1 && Math.abs(SourcePosition.y - targetPosition.y) === 2) return true;
            return false;
        case "pawn":
            if(target.firstChild!==null) {
                if(source.firstChild.getAttribute("class")!==target.firstChild.firstChild.getAttribute("class")) {
                    if(source.firstChild.getAttribute("class")==="black")
                    {
                        if(Math.abs(SourcePosition.y - targetPosition.y) === 1 && targetPosition.x - SourcePosition.x === 1) return true;
                    }
                    else {
                        if(Math.abs(SourcePosition.y - targetPosition.y) === 1 && targetPosition.x - SourcePosition.x === -1) return true;
                    }
                }
            }
            else {
                if(source.firstChild.getAttribute("class")==="black")
                {
                    if((targetPosition.x - SourcePosition.x) === 1 && (targetPosition.y === SourcePosition.y)) return true;
                    else if(SourcePosition.x === 1 && (targetPosition.x - SourcePosition.x) === 2 && (targetPosition.y === SourcePosition.y) && document.getElementById(`{"x":${SourcePosition.x+1},"y":${SourcePosition.y}}`).firstChild===null) return true;
                }
                else {
                    if((targetPosition.x - SourcePosition.x) === -1 && (targetPosition.y === SourcePosition.y)) return true;
                    else if(SourcePosition.x === 6 && (targetPosition.x - SourcePosition.x) === -2 && (targetPosition.y === SourcePosition.y) && document.getElementById(`{"x":${SourcePosition.x-1},"y":${SourcePosition.y}}`).firstChild===null) return true;
                }
            }
        return false;
    }
    return true;
}


let source = null;

function dragSource(e){
    source = e.target;
    console.log(source);
}


const pieces = document.querySelectorAll(".piece");
console.log(pieces)
pieces.forEach(piece => {
    piece.addEventListener("dragstart", dragSource);
});


const squares = document.querySelectorAll(".square");

squares.forEach(square => {
    square.addEventListener("dragover", (e) => {
        e.preventDefault();
        //console.log(e.target);
    })
    square.addEventListener("drop", (e) => {
        e.preventDefault();
        //console.log(e.target);
        valid = true;
       // console.log(e.target.classList[0])
        const target = e.target.classList[0]==="square"?e.target:e.target.parentNode; //care here if this is not there..then if we take non empty position then target is actually becoming target child
       // console.log("before",target);
        valid = checkValidity(source, target);
       console.log("checking..validity",valid);
        if(valid && target.firstChild===null) {
            source.parentNode.removeChild(source);
            target.appendChild(source);
            playerDisplay.innerHTML  = playerDisplay.innerHTML==="white"?"black":"white";
            localStorage.setItem("player", playerDisplay.innerHTML);
            localStorage.setItem("board", JSON.stringify(gameBoard.innerHTML));
            console.log(target);
        } 
        else if(valid && target.firstChild!==null){
            console.log(target.firstChild.id);
             const checkmate = target.firstChild.id === "king" ? true : false;
            //e.target.removeChild(e.target.firstChild);
            source.parentNode.removeChild(source);
                target.removeChild(target.firstChild);
                target.appendChild(source);
                //console.log(e.target);
               
                if(checkmate) {
                    infoDisplay.innerHTML = `${playerDisplay.innerHTML} wins`;
                    alert(`${playerDisplay.innerHTML} wins`);
                    reset.click();
                    
                }
                else {
                    playerDisplay.innerHTML  = playerDisplay.innerHTML==="white"?"black":"white";
                    localStorage.setItem("player", playerDisplay.innerHTML);
                    localStorage.setItem("board", JSON.stringify(gameBoard.innerHTML));
                }
        }
        
    })
});

