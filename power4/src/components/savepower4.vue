<template>
<div id="all">
    <div>Power 4</div>
    <div id="container"></div>
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
        // red = 1
        // green = 2
        tableTest: [
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [0,0,0,0,0,0],
            [0,0,0,1,0,0],
            [0,0,1,1,0,0],
            [0,1,1,0,0,0],
            [0,0,1,1,0,0],
            [1,1,0,0,0,0],
            [1,1,0,0,0,0],
            [1,0,0,0,0,0],
            // [1,0,0,0,0,0],
            // [2,0,0,0,0,0],
            // [0,0,0,0,0,0],
            // [2,2,0,0,0,0],
            // [2,1,0,0,0,0],
            // [1,0,0,0,0,0],
            // [0,0,0,0,0,0],
        ],
        tile: [],
        }
  },
  mounted(){
      this.init()
      this.animate()
      let currentPlayer = 1

      for (let index = 0; index < 1; index++) {
            currentPlayer = currentPlayer === 1 ? 1 : 2 
            console.log('currentPlayer:', currentPlayer)
            this.play(this.tableTest, currentPlayer)
            currentPlayer = currentPlayer === 1 ? 2 : 1 
      }
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
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

    },
    animate() {
        requestAnimationFrame(this.animate);
        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    },
    play(table, player){
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
            let marker = 0
            // determine the player
            if(player === 1){
                marker = 1
                var color = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
            }else if(player === 2){
                marker = 2
                var color = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
            }
            let x = 3
            let y = 0
            this.table[x][y] = marker // mark visual
            table[x][y] = marker
            const geometry = new Three.PlaneGeometry( 1, 1 );
            let mat = color
            this.tile[x][y] = new Three.Mesh( geometry, mat )
            this.scene.add(this.tile[x][y]);
            this.tile[x][y].position.x = x
            this.tile[x][y].position.y = y
        }else{



    // test
    var opponentCanWin = false
    var canWin = false

    // check X -
    console.log('[CHECK X]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(x+3 <= 6 && x-3 >= 0){
                let testXRight = table[x+1][y] === table[x+2][y] && table[x+1][y] === table[x+3][y] && table[x+1][y] !== 0
                console.log('testXRight:', testXRight)
                let testXLeft = table[x-1][y] === table[x-2][y] && table[x-1][y] === table[x-3][y] && table[x-1][y] !== 0
                console.log('testXLeft:', testXLeft)
            }
            if(x+2 <= 6 && x-1 >=0){
                let testXOneTwo =  table[x+1][y] === table[x-1][y] && table[x+1][y] === table[x+2][y] && table[x+1][y] !== 0
                console.log('testXOneTwo:', testXOneTwo)
            }
            if(x-2 >= 0 && x+1 <=6){
                let testXTwoOne =  table[x-1][y] === table[x-2][y] && table[x+1][y] === table[x-1][y] && table[x-1][y] !== 0
                console.log('testXTwoOne:', testXTwoOne) 
            }
        }
    }
    // // check Y |
    console.log('[CHECK Y]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(y+3 <= 5 && y-3 >= 0){
                let testYUp = table[x][y+1] === table[x][y+2] && table[x][y+1] === table[x][y+3] && table[x][y+1] !== 0
                console.log('testYUp:', testYUp)
                let testDown = table[x][y-1] === table[x][y-2] && table[x][y-1] === table[x-3][y] && table[x][y-1] !== 0
                console.log('testDown:', testDown)
            }
        }
    }
    // check /
    console.log('[CHECK /]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(x-3 >= 0 && y-3 >= 0){
                let testDown = table[x-1][y-1] === table[x-2][y-2] && table[x-1][y-1] === table[x-3][y-3] && table[x-1][y-1] !== 0
                console.log('testDown:', testDown)
            }
            if(x+3 <= 6 && y+3 <= 5){
                let testUp = table[x+1][y+1] === table[x+2][y+2] && table[x+1][y+1] === table[x+3][y+3] && table[x+1][y+1] !== 0
                console.log('testUp:', testUp)
            }
            if(x+1 <= 6 && y+1 <= 5 && x-2 >= 0 && y-2 >= 0){
                let testTwoOne = table[x+1][y+1] === table[x-2][y-2] && table[x+1][y+1] === table[x-1][y-1] && table[x-1][y-1] !== 0
                console.log('testTwoOne:', testTwoOne)
            }
            if(x-1 >= 0 && y-1 >= 0 && x+2 <= 6 && y+2 <= 5){
                let testOneTwo = table[x-1][y-1] === table[x+2][y+2] && table[x-1][y-1] === table[x+1][y+1] && table[x-1][y-1] !== 0
                console.log('testOneTwo:', testOneTwo)

            }
        }
    }  
    // check \
    console.log('[CHECK \ ]')
    for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 6; y++) {
            console.log('position:', '['+x+';'+y+']')
            if(x+3 <= 6 && y-3 >= 0){
                let testDown = table[x+1][y-1] === table[x+2][y-2] && table[x+1][y-1] === table[x+3][y-3] && table[x+1][y-1] !== 0
                console.log('testDown:', testDown)
            }
            if(x-3 >= 0 && y+3 <= 5){
                let testUp = table[x-1][y+1] === table[x-2][y+2] && table[x-1][y+1] === table[x-3][y+3] && table[x-1][y+1] !== 0
                console.log('testUp:', testUp)
            }
            if(x+1 <= 6 && x-2 >= 0 && y-1 >= 0 && y+2 <= 5){
                let testTwoOne = table[x+1][y-1] === table[x-1][y+1] && table[x+1][y-1] === table[x-2][y+2] && table[x+1][y-1] !== 0
                console.log('testTwoOne:', testTwoOne)
                // ici je dois check
            }
            if(x-1 >= 0 && y-1 >= 0 && x+2 <= 6 && y+2 <= 5){
                let testOneTwo = table[x-1][y+1] === table[x+1][y-1] && table[x-1][y+1] === table[x+2][y-2] && table[x-1][y+1] !== 0
                console.log('testOneTwo:', testOneTwo)
            }
        }
    }  

    // test
            // check move to win
            // check - & |
            var opponentCanWin = false
            var opponent = player === 1 ? 2 : 1
            var canWin = false
            for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 6; y++) {

                    // check X -
                    if(x-2 >= 0 && 6 >= x+2){
                        
                        // check 3 line
                        let checkXEnd = table[x][y] === table[x+1][y]  && table[x][y] === table[x+2][y]
                        let checkXStart = table[x][y] === table[x-2][y]  && table[x-1][y]  === table[x][y]  
                        let checkXCenter = table[x][y]  === table[x-1][y] &&  table[x][y] === table[x+1][y]
                        if(checkXCenter){

                        }else if(checkXStart){

                        }else if(checkXEnd){

                        }

                        // check 1 + 2 line

                    }
                    // check Y |
                    if(y-2 >= 0 && 6 >= y+2){
                        
                        // check 3 line

                        // check 1 + 2 line

                    }


                    // --------
                    // // check X -
                    // if(x === 0){
                    //     // player & opponent
                    //     let checkX = table[x][y] === table[x+1][y]  && table[x][y] === table[x+2][y]
                    //     if(checkX){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }                  
                    // }else if(x === 6){
                    //     // player & opponent
                    //     let checkX = table[x][y] === table[x-2][y]  && table[x-1][y]  === table[x][y]  
                    //     if(checkX){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }            
                    // }else{  
                    //     // player & opponent
                    //     let checkX = table[x][y]  === table[x-1][y] &&  table[x][y] === table[x+1][y]
                    //     if(checkX){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }                    
                    // }
                    // // ------------------
                    // // check Y |
                    // if(y === 0){
                    //     // player & opponent
                    //     let checkY = table[x][y] === table[x][y+1] && table[x][y] === table[x][y+2]
                    //     if(checkY){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }                                 
                    // }else if(y === 5){
                    //     // player & opponent
                    //     let checkY = table[x][y] === table[x][y-2] && table[x][y] === table[x][y-1]  
                    //     if(checkY){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }                
                    // }else{    
                    //     // player & opponent
                    //     let checkY = table[x][y] === table[x][y-1] && table[x][y] === table[x][y+1]
                    //     if(checkY){
                    //         if(table[x][y] === player){
                    //             canWin = true
                    //         }else if(table[x][y] === opponent){
                    //             opponentCanWin = true
                    //         }
                    //     }                 
                    // }
                }
            }
            // diagonale /
            for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 6; y++) {
                    if(y + 2 <= 5 &&  x + 2 <= 6){
                        let checkDiagoRight = table[x+2][y+2] === table[x][y] && table[x][y] === table [x+1][y+1]
                        if(checkDiagoRight){
                            if(table[x][y] === player){
                                canWin = true
                            }else if(table[x][y] === opponent){
                                opponentCanWin = true
                            }
                        }
                    }
                }
            }
            // diagonale \
            for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 6; y++) {
                    if(y + 2 <= 5 &&  x - 2 >= 0){
                        let checkDiagoLeft = table[x-1][y+1] === table[x][y] && table[x][y] === table [x-2][y+2]
                        if(checkDiagoLeft){
                            if(table[x][y] === player){
                                canWin = true
                            }else if(table[x][y] === opponent){
                                opponentCanWin = true
                            }
                        }
                    }
                }
            }
            // make move 
            var move = false
            var bestMove = null
            for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 6; y++) {
                    if(!checkUsed(table[x][y]) && !move){
                      if(canPlay(table,x,y) && !move){
                        
                        // TODO : prevent help opponent
                        // check around y + 1 si 


                        // chose best play
                        // check around
                        let makeMove = false
                        console.log('position:', '['+x+';'+y+']')
                        console.log('check 2')
                        // check 2 cases
                        // vertical & horizontal
                        // if(0 <= x-2 &&  x+2 <= 6){
                        //     let checkRight = table[x+2][y] === player && player === table[x+1][y]
                        //     if(checkRight){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRight:', checkRight)
                        //     let checkLeft = table[x-2][y] === player && player === table[x-1][y]
                        //     if(checkLeft){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeft:', checkLeft)
                        // }
                        // if(0 <= y-2 && y+2 <= 5){
                        //     let checkUp = table[x][y+2] === player && player === table[x][y+1]
                        //     if(checkUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkUp:', checkUp)
                        //     let checkDown = table[x][y-2] === player && player === table[x][y-1]
                        //     if(checkDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkDown:', checkDown)
                        // }
                        // // diagonales
                        // console.log('check 1')
                        // if(0 <= x-2 && 0 <= y-2 && x+2 <= 6 && y+2 <= 5){
                        //     let checkRightUp = table[x+2][y+2] === player && player === table[x+1][y+1] 
                        //     if(checkRightUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRightUp:', checkRightUp)
                        //     let checkRightDown = table[x+2][y-2] === player && player === table[x+1][y-1] 
                        //     if(checkRightDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRightDown:', checkRightDown)
                        //     let checkLeftUp = table[x-2][y+2] === player && player === table[x-1][y+1]
                        //     if(checkLeftUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeftUp:', checkLeftUp)
                        //     let checkLeftDown = table[x-2][y-2] === player && player === table[x-1][y-1]
                        //     if(checkLeftDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeftDown:', checkLeftDown)
                        // }
                        // // check 1 case
                        // // vertical & horizontal
                        // if(0 <= x-1 &&  x+1 <= 6){
                        //     let checkRight = table[x+1][y] === player
                        //     if(checkRight){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRight:', checkRight)
                        //     let checkLeft = table[x-1][y] === player
                        //     if(checkLeft){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeft:', checkLeft)
                        // }
                        // if(0 <= y-1 && y+1 <= 5){
                        //     let checkUp = table[x][y+1] === player
                        //     if(checkUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkUp:', checkUp)
                        //     let checkDown = table[x][y-1] === player
                        //     if(checkDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkDown:', checkDown)
                        // }
                        // // diagonales
                        // if(0 <= x-1 && 0 <= y-1 && x+1 <= 6 && y+1 <= 5){
                        //     let checkRightUp = table[x+1][y+1] === player
                        //     if(checkRightUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRightUp:', checkRightUp)
                        //     let checkRightDown = table[x+1][y-1] === player
                        //     if(checkRightDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkRightDown:', checkRightDown)
                        //     let checkLeftUp = table[x-1][y+1] === player
                        //     if(checkLeftUp){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeftUp:', checkLeftUp)
                        //     let checkLeftDown = table[x-1][y-1] === player
                        //     if(checkLeftDown){
                        //         makeMove = true
                        //     }
                        //     console.log('checkLeftDown:', checkLeftDown)
                        // }

                        if(makeMove){
                            // move
                            // if(player === 1){
                            //     var color = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
                            // }else if(player === 2){
                            //     var color = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
                            // }
                            // const geometry = new Three.PlaneGeometry( 1, 1 );
                            // let mat = color
                            // this.tile[x][y] = new Three.Mesh( geometry, mat )
                            // this.scene.add(this.tile[x][y]);
                            // this.tile[x][y].position.x = x
                            // this.tile[x][y].position.y = y
                            // table[x][y] = player 
                            // move = true

                        }

                      }
                    }
                }
            }
        }

        // console.log('canWin:', canWin)
        // console.log('opponentCanWin:', opponentCanWin)

        // color all case 
        console.log('table:', table)
        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 6; y++) {

                if(table[x][y] === 1){
                    var moveColor = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
                }else if(table[x][y]  === 2){
                    var moveColor = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
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

        // function makeMove(table,x,y, player){

        //     if(player === 1){
        //         var color = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
        //     }else if(player === 2){
        //         var color = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
        //     }
        //     const geometry = new Three.PlaneGeometry( 1, 1 );
        //     let mat = color
        //     this.tile[x][y] = new Three.Mesh( geometry, mat )
        //     this.scene.add(this.tile[x][y]);
        //     this.tile[x][y].position.x = x
        //     this.tile[x][y].position.y = y
        //     table[x][y] = player 

        // }


        // console.log('table', table)
        // console.log('firstMove', firstMove)

    }
    }

}
</script>

<style scoped>
  #container{
    width: 1000px;
    height: 700px;
    margin-left: auto;
    margin-right: auto;
  }

</style>