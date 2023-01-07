<template>
<div id="all">
    <div>Power 4</div>
    <div id="container"></div>
    <div class="btn-group">
        <button class="btn" v-on:click="Play(0, 1)">1</button>  
        <button class="btn" v-on:click="Play(1, 1)">2</button>    
        <button class="btn" v-on:click="Play(2, 1)">3</button>     
        <button class="btn" v-on:click="Play(3, 1)">4</button>    
        <button class="btn" v-on:click="Play(4, 1)">5</button>    
        <button class="btn" v-on:click="Play(5, 1)">6</button>    
        <button class="btn" v-on:click="Play(6, 1)">7</button>
    </div>
    <br>
    <button  v-on:click="IaPlay(table, 2)">IA play</button>
    <br>
    <button  v-on:click="Replay()">Replay</button>
    <br>
    <button  v-on:click="RemoveLastMove()">RemoveLastMove</button>
</div>
</template>

<script>
import * as Three from 'three';
export default {
    data () {
        return {
        scene:undefined,
        camera:undefined,
        renderer:undefined,
        table: [],
        tile: [],
        tab: [],
        lastMove:{
            x:null,
            y:null,
        },
        }
  },
  mounted(){
    // red = 2 == IA
    // green = 1 == Player
    this.init()
    this.animate()
    this.colorAllCases()
  },
  methods:{
    init(){
        let container = document.getElementById('container');
        let tailleTab = 7
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 20);
        this.camera.position.z = 6;
        this.camera.position.x = tailleTab/2;
        this.camera.position.y = tailleTab/2;

        this.scene = new Three.Scene();
        var tab =[]
        let tile = []

        const geometry = new Three.PlaneGeometry( 1, 1 );
        const empty = new Three.MeshBasicMaterial( {color: 0xf4fefe, side: Three.DoubleSide} );

        for (let x = 0; x < tailleTab; x++) {
            tab[x] = []; 
            tile[x] = [];
            for (let y = 0; y < 6; y++) {
                let mat = empty
                tab[x][y] = 0;
                tile[x][y] = new Three.Mesh( geometry, mat )
                this.scene.add(tile[x][y]);
                tile[x][y].position.x = x
                tile[x][y].position.y = y

                // wireframe
                var geoLine = new Three.EdgesGeometry( tile[x][y].geometry );
                var matLine = new Three.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
                var wireframe = new Three.LineSegments( geoLine, matLine );
                wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
                tile[x][y].add( wireframe );
            }
        }
        this.table = tab;
        this.tile = tile;
        this.renderer = new Three.WebGLRenderer({antialias: true});
        console.log(container.clientWidth)
        console.log(container.clientHeight)
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

    },
    animate() {
        requestAnimationFrame(this.animate);
        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    },
    colorAllCases(){
        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 6; y++) {

                if(this.table[x][y] === 1){
                    var moveColor = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
                }else if(this.table[x][y]  === 2){
                    var moveColor = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
                }else{
                    var moveColor = new Three.MeshBasicMaterial( {color: 0xf4fefe, side: Three.DoubleSide} );
                }
                const geometry = new Three.PlaneGeometry( 1, 1 );
                let mat = moveColor
                this.tile[x][y] = new Three.Mesh( geometry, mat )
                this.scene.add(this.tile[x][y]);
                this.tile[x][y].position.x = x
                this.tile[x][y].position.y = y
            }
        }
    },
    RemoveLastMove(){
        console.log('this.lastMove:', this.lastMove)
        console.log(this.table)
        this.Play(this.lastMove.x, 0, true)
        console.log(this.table)
    },
    Replay(){
        let emptyTable =  [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
        ]
        this.table = emptyTable
        this.colorAllCases()
    },
    Play(col, player, goBack) {
        function getEmptyRow (colIndex, currBoard) { // get the first empty row in a given column
            for (var i = 0; i < 6; i++) {
                if (currBoard[colIndex][i] === 0) {
                    return i
                }
            }
            return -1
        }
        if(goBack){
            this.table[col][getEmptyRow(col, this.table) -1] = player
        }else{
            this.table[col][getEmptyRow(col, this.table)] = player
        }
        this.lastMove.x = col
        this.lastMove.y = getEmptyRow(col, this.table) - 1
        this.colorAllCases()
    },
    IaPlay(table, player){
        // check if its first move
        let firstMove = true
        table.forEach(element => {
            element.forEach(item => {
                if(item !== 0){
                    firstMove = false
                }
            })
        });
        // first move 
        if(firstMove){
            this.Play(3, 2, false)
        }else{

    var Ia = {
        play:null,
        canWin:false,

        twoCasePlay:null,
        twoCaseMove:false,
        oneCasePlay:null,
        oneCaseMove:false,
    }
    var Player = {
        play:null,
        canWin:false,
    }
    var hasPlayed = false
    // check X -
    console.log('[CHECK X]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    if(x+3 <= 6){
                        let testXRight = table[x+1][y] === table[x+2][y] && table[x+1][y] === table[x+3][y] && table[x+1][y] !== 0
                        if(testXRight){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x-3 >= 0){
                        let testXLeft = table[x-1][y] === table[x-2][y] && table[x-1][y] === table[x-3][y] && table[x-1][y] !== 0
                        console.log('testXLeft:', testXLeft)
                        if(testXLeft){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x+2 <= 6 && x-1 >=0){
                        let testXOneTwo =  table[x+1][y] === table[x-1][y] && table[x+1][y] === table[x+2][y] && table[x+1][y] !== 0
                        console.log('testXOneTwo:', testXOneTwo)
                        if(testXOneTwo){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x-2 >= 0 && x+1 <=6){
                        let testXTwoOne =  table[x-1][y] === table[x-2][y] && table[x+1][y] === table[x-1][y] && table[x-1][y] !== 0
                        console.log('testXTwoOne:', testXTwoOne) 
                        if(testXTwoOne){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                }
            }
        }
    }
    // // check Y |
    console.log('[CHECK Y]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    console.log('position:', '['+x+';'+y+']')
                    if(y-3 >= 0){
                        let testDown = table[x][y-1] === table[x][y-2] && table[x][y-1] === table[x][y-3] && table[x][y-1] !== 0
                        console.log('testDown:', testDown)
                        if(testDown){
                            if(table[x][y-1] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                }
            }
        }
    }
    // check /
    console.log('[CHECK /]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    console.log('position:', '['+x+';'+y+']')
                    console.log('position:', table[x][y])
                    if(x-3 >= 0 && y-3 >= 0){
                        let testDown = table[x-1][y-1] === table[x-2][y-2] && table[x-1][y-1] === table[x-3][y-3] && table[x-1][y-1] !== 0
                        console.log('testDown:', testDown)
                        if(testDown){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x+3 <= 6 && y+3 <= 5){
                        let testUp = table[x+1][y+1] === table[x+2][y+2] && table[x+1][y+1] === table[x+3][y+3] && table[x+1][y+1] !== 0
                        console.log('testUp:', testUp)
                        if(testUp){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x+1 <= 6 && y+1 <= 5 && x-2 >= 0 && y-2 >= 0){
                        let testTwoOne = table[x+1][y+1] === table[x-2][y-2] && table[x+1][y+1] === table[x-1][y-1] && table[x-1][y-1] !== 0
                        console.log('testTwoOne:', testTwoOne)
                        if(testTwoOne){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x-1 >= 0 && y-1 >= 0 && x+2 <= 6 && y+2 <= 5){
                        let testOneTwo = table[x-1][y-1] === table[x+2][y+2] && table[x-1][y-1] === table[x+1][y+1] && table[x-1][y-1] !== 0
                        console.log('testOneTwo:', testOneTwo)
                        if(testOneTwo){
                            console.log('ici')
                            console.log('table[x-1][y-1] === 2:', table[x-1][y-1] === 2)
                            if(table[x-1][y-1] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                }
            }
        }
    }  
    // check \
    console.log('[CHECK \ ]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    console.log('position:', '['+x+';'+y+']')
                    if(x+3 <= 6 && y-3 >= 0){
                        let testDown = table[x+1][y-1] === table[x+2][y-2] && table[x+1][y-1] === table[x+3][y-3] && table[x+1][y-1] !== 0
                        console.log('testDown:', testDown)
                        if(testDown){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x-3 >= 0 && y+3 <= 5){
                        let testUp = table[x-1][y+1] === table[x-2][y+2] && table[x-1][y+1] === table[x-3][y+3] && table[x-1][y+1] !== 0
                        console.log('testUp:', testUp)
                        if(testUp){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x+1 <= 6 && x-2 >= 0 && y-1 >= 0 && y+2 <= 5){
                        let testTwoOne = table[x+1][y-1] === table[x-1][y+1] && table[x+1][y-1] === table[x-2][y+2] && table[x+1][y-1] !== 0
                        console.log('testTwoOne:', testTwoOne)
                        if(testTwoOne){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                    if(x-1 >= 0 && y-1 >= 0 && x+2 <= 6 && y+2 <= 5){
                        let testOneTwo = table[x-1][y+1] === table[x+1][y-1] && table[x-1][y+1] === table[x+2][y-2] && table[x-1][y+1] !== 0
                        console.log('testOneTwo:', testOneTwo)
                        if(testOneTwo){
                            if(table[x+1][y] === 2){
                                Ia.play = x
                                Ia.canWin = true
                            }else{
                                Player.play = x
                                Player.canWin = true
                            }
                        }
                    }
                }

            }
        }
    }  

    if(Ia.canWin){
        console.log('Ia:')
        console.log('Ia:', Ia)
        console.log('hasPlayed:', hasPlayed)
        this.Play(Ia.play, 2, false)
        return 'stop'

    }else if(Player.canWin){
        console.log('Player.canWin:')
        console.log('Ia:', Ia)
        console.log('hasPlayed:', hasPlayed)
        this.Play(Player.play, 2, false)
        return 'stop'
    }

    // check 2 cases
    console.log('[CHECK 2 cases ]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    if(checkDontHelpOpponent(table,x,y,1) <= 2){
                        if(x+2 <= 6){
                            let checkRight = table[x+2][y] === player && player === table[x+1][y]
                            console.log('checkRight:', checkRight)
                            if(checkRight){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                        }
                        if(0 <= x-2){
                            let checkLeft = table[x-2][y] === player && player === table[x-1][y]
                            if(checkLeft){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkLeft:', checkLeft)
                        }
                        if(0 <= y-2){
                            let checkUp = table[x][y+2] === player && player === table[x][y+1]
                            if(checkUp){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkUp:', checkUp)
                        }
                        if(y+2 <= 5){
                            let checkDown = table[x][y-2] === player && player === table[x][y-1]
                            if(checkDown){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkDown:', checkDown)
                        }
                        // diagonales
                        console.log('check 1')
                        if(0 <= x-2 && 0 <= y-2 && x+2 <= 6 && y+2 <= 5){
                            let checkRightUp = table[x+2][y+2] === player && player === table[x+1][y+1] 
                            if(checkRightUp){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkRightUp:', checkRightUp)
                            let checkRightDown = table[x+2][y-2] === player && player === table[x+1][y-1] 
                            if(checkRightDown){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkRightDown:', checkRightDown)
                            let checkLeftUp = table[x-2][y+2] === player && player === table[x-1][y+1]
                            if(checkLeftUp){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkLeftUp:', checkLeftUp)
                            let checkLeftDown = table[x-2][y-2] === player && player === table[x-1][y-1]
                            if(checkLeftDown){
                                Ia.twoCasePlay = x
                                Ia.twoCaseMove = true
                            }
                            console.log('checkLeftDown:', checkLeftDown)
                        }
                    }
                }
            }
        }
    }
    console.log('[CHECK 1 case ]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(!checkUsed(table[x][y])){
                if(canPlay(table,x,y)){
                    if(checkDontHelpOpponent(table,x,y,1) <= 2){
                        if(0 <= x-1 &&  x+1 <= 6){
                            let checkRight = table[x+1][y] === player
                            if(checkRight){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkRight:', checkRight)
                            let checkLeft = table[x-1][y] === player
                            if(checkLeft){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkLeft:', checkLeft)
                        }
                        if(0 <= y-1 && y+1 <= 5){
                            let checkUp = table[x][y+1] === player
                            if(checkUp){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkUp:', checkUp)
                            let checkDown = table[x][y-1] === player
                            if(checkDown){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkDown:', checkDown)
                        }
                        // diagonales
                        if(0 <= x-1 && 0 <= y-1 && x+1 <= 6 && y+1 <= 5){
                            let checkRightUp = table[x+1][y+1] === player
                            if(checkRightUp){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkRightUp:', checkRightUp)
                            let checkRightDown = table[x+1][y-1] === player
                            if(checkRightDown){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkRightDown:', checkRightDown)
                            let checkLeftUp = table[x-1][y+1] === player
                            if(checkLeftUp){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkLeftUp:', checkLeftUp)
                            let checkLeftDown = table[x-1][y-1] === player
                            if(checkLeftDown){
                                Ia.oneCasePlay = x
                                Ia.oneCaseMove = true
                            }
                            console.log('checkLeftDown:', checkLeftDown)
                        }
                    }
                }
            }
        }
    }
    if(Ia.twoCaseMove){
        this.Play(Ia.twoCasePlay, 2, false)
        return 'stop'
    }else if(Ia.oneCaseMove){
        this.Play(Ia.oneCasePlay, 2, false)
        return 'stop'
    }

if(!hasPlayed){
    console.log('hasPlayed:', hasPlayed)
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    this.Play(getRandomInt(7), 2, false)
    return 'stop'
}
        // color all case 
        this.colorAllCases()

        // check case y-1
        function canPlay(table,x,y){
            if(table[x][y-1] != 0){
                return true
            }else{
                return false
            }
        }
        // check the case 
        function checkUsed(position){
            if(position !== 0){
                    return true
                }else{
                    return false
                }
            }
        function checkDontHelpOpponent(table,x,y, player){
            console.log('position:', '['+x+';'+y+']')

            let opponent = player === 1 ? 2 : 1
            let positionUp = table[x][y+1]
            var result = 0
            if(positionUp === 0){
                // check –
                if(y+1 <= 5 && x+1 <= 6 ){
                    let checkRight = opponent === table[x+1][y+1]
                    console.log('checkRight:', checkRight)
                    if(checkRight){
                        result += 1
                    }
                }
                if(y+1 <= 5 && x-1 >=0){
                    let checkLeft = opponent === table[x-1][y+1]
                    console.log('checkLeft:', checkLeft)
                    if(checkLeft){
                        result += 1
                    }
                }
                // check /
                if(x+1 <= 6 && y+2 <= 5){
                    let checkUpRight = opponent === table[x+1][y+2]
                    console.log('checkUpRight:', checkUpRight)
                    if(checkUpRight){
                        result += 1
                    }
                }
                if(x-1 >= 0){
                    let checkDownLeft = opponent === table[x-1][y]
                    console.log('checkDownLeft:', checkDownLeft)
                    if(checkDownLeft){
                        result += 1
                    }
                }
                // check \
                if(x+1 <= 6){
                    let checkDownRight = opponent === table[x+1][y]
                    console.log('checkDownRight:', checkDownRight)
                    if(checkDownRight){
                        result += 1
                    }
                }
                if(x-1 >= 0 && y+2 <= 5){
                    let checkUpLeft = opponent === table[x-1][y+2]
                    console.log('checkUpLeft:', checkUpLeft)
                    if(checkUpLeft){
                        result += 1
                    }
                }
            }
            return result
        }
    }
    }
}
}
</script>

<style scoped>
  #container{
    width: 700;
    height: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  .btn{
      width: 80px;
  }
  .btn-group{
      display: flex;
      justify-content: center;
  }

</style>