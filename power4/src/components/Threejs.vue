<template>
  <div id="all">
    <h1> Dijkstra</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three';
import test from '../../test/e2e/specs/test';
export default {
  name: 'Dijkstra',
  data () {
    return {
      scene:undefined,
      camera:undefined,
      renderer:undefined,
      caseUsed: [],
      attempts: 0,
      min:100
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('container');
        let tailleTab = 16
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 20);
        this.camera.position.z = 15;
        this.camera.position.x = tailleTab/2;
        this.camera.position.y = tailleTab/2;

        this.scene = new Three.Scene();
        var tab =[]
        let tile = []
        const geometry = new Three.PlaneGeometry( 1, 1 );
        const terre = new Three.MeshBasicMaterial( {color: 0x32CD32, side: Three.DoubleSide} );
        const lave = new Three.MeshBasicMaterial( {color: 0xed0000, side: Three.DoubleSide} );
        //generation map

        for (let i = 0; i < tailleTab; i++) {
            tab[i] = []; 
            tile[i]=[];
            this.caseUsed[i] = []

            for (let j = 0; j < tailleTab; j++) {
              this.caseUsed[i][j] = false
              let mat = terre
              tab[i][j] = "terre";
              if(Math.floor(Math.random() * 3)==0){ 
                mat = lave
                tab[i][j] = "lave";
              }
              tile[i][j] = new Three.Mesh( geometry, mat )
              this.scene.add(tile[i][j]);
              //console.log(i + "  " +j)
              tile[i][j].position.x = i
              tile[i][j].position.y = j
            }
          }

        let xkey = Math.floor(Math.random() * tailleTab)
        let ykey = Math.floor(Math.random() * tailleTab)
        tab[xkey][ykey] = "key" 
        tile[xkey][ykey].material = new Three.MeshBasicMaterial( {color: 0xffff00, side: Three.DoubleSide} );
        //generation hero
        var x = xkey 
        var y = ykey
        while(x == xkey && y == ykey){
          x = Math.floor(Math.random() * tailleTab)
          y = Math.floor(Math.random() * tailleTab)
        }
        tab[x][y] = "Hero" 
        let currentPosition = tab[x][y]
        tile[x][y].material = new Three.MeshBasicMaterial( {color: 0xf4fefe, side: Three.DoubleSide} );

          // tentative #2
        this.searchMin(tab, tile, x, y)
        // for (let index = 0; index < 5000; index++) {
        //   this.search(tab, tile, x, y)
        //   if(this.attempts < this.min || this.min === null){
        //     this.min = this.attempts
        //   }
        // }
        console.log('attempts', this.attempts)
        console.log('min', this.min)
   
          


          // tentative #1
          // let index = 0
          // var everUsed = []
          // let moves = ['right', 'left', 'up', 'down']
          // let hasNotKey = true;
          // var attempts = 0
          // var out = false
          // while (hasNotKey && !out) {
          //   if(foundKey()){
          //     console.log('key found')
          //     console.log('attempts:', attempts)
          //     hasNotKey = false
          //     break
          //   }
          //   if(attempts === 5000){
          //     out = true
          //     console.log('key not found')
          //     console.log('attempts:', attempts)
          //   }
          //   attempts += +1
          //   let right = x+1
          //   let left = x-1
          //   let up = y+1
          //   let down = y-1
            
          //   let move = moves[Math.floor(Math.random()*moves.length)]
          //   switch (move) {
          //     case 'right':
          //       if(0 <= right && right <= 15 && tab[right][y] != "lave"){
          //         const geo = new Three.PlaneGeometry( 0.7, 0.7 );
          //         const ma = new Three.MeshBasicMaterial( {color: 0xfaaaa, side: Three.DoubleSide} );
          //         const pla = new Three.Mesh( geo, ma)
          //         this.scene.add(pla);
          //         pla.position.x = right
          //         pla.position.y = y
          //         x +=1
          //       }
          //       break;
          //     case 'up':
          //       if(0 <= up && up <= 15 && tab[x][up] != "lave"){
          //         const geo = new Three.PlaneGeometry( 0.7, 0.7 );
          //         const ma = new Three.MeshBasicMaterial( {color: 0xfaaaa, side: Three.DoubleSide} );
          //         const pla = new Three.Mesh( geo, ma)
          //         this.scene.add(pla);
          //         pla.position.x = x
          //         pla.position.y = up
          //         y +=1
          //       } 
          //       break;
          //     case 'left':
          //       if(0 <= left && left <= 15 && tab[left][y] != "lave"){
          //         const geo = new Three.PlaneGeometry( 0.7, 0.7 );
          //         const ma = new Three.MeshBasicMaterial( {color: 0xfaaaa, side: Three.DoubleSide} );
          //         const pla = new Three.Mesh( geo, ma)
          //         this.scene.add(pla);
          //         pla.position.x = left
          //         pla.position.y = y
          //         x -=1
          //       }  
          //       break;
          //     case 'down':
          //       if( 0 <= down && down <= 15 && tab[x][down] != "lave"){
          //         const geo = new Three.PlaneGeometry( 0.7, 0.7 );
          //         const ma = new Three.MeshBasicMaterial( {color: 0xfaaaa, side: Three.DoubleSide} );
          //         const pla = new Three.Mesh( geo, ma)
          //         this.scene.add(pla);
          //         pla.position.x = x
          //         pla.position.y = down
          //         y -=1
          //       }
          //       break;
          //     default:
          //       break;
          //   }  
          // }
          function foundKey(){
            if(tab[x][y] == "key"){
              return true
            } else {
              return false
            }
          }            
//------------------------------------------------------------------------------------------------------------------
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

    },
    searchMin: function (tab, tile, x, y){
        while(this.min > 15){
          this.search(tab, tile, x, y)
          if(this.attempts < this.min){
            this.min = this.attempts
          }
        }
    },
    search: function (tab, tile, x, y){
        this.scene
        const geo = new Three.PlaneGeometry( 0.7, 0.7 );
        const ma = new Three.MeshBasicMaterial( {color: 0xfaaaa, side: Three.DoubleSide} );
        const pla = new Three.Mesh( geo, ma)
        this.scene.add(pla);
        pla.position.x = x
        pla.position.y = y

        this.caseUsed[x][y] = true
        this.attempts += 1

        let right = x+1
        let left = x-1
        let up = y+1
        let down = y-1
        if(
          right <= 15 && tab[right][y] == "key" ||
          0 <= left && tab[left][y] == "key" ||
          up <= 15 && tab[x][up] == "key" ||
          0 <= down && tab[x][down] == "key" 
        )
        {
          return true
        }else{
          
          if(right <= 15 && tab[right][y] != "lave" && !this.caseUsed[right][y]){
            if(this.search(tab, tile, right, y)){
              return true
            }
          }
          if(0 <= left && tab[left][y] != "lave" && !this.caseUsed[left][y]){
            if(this.search(tab, tile, left, y)){
              return true
            }
            
          }
          if(up <= 15 && tab[x][up] != "lave" && !this.caseUsed[x][up]){
            if(this.search(tab, tile, x, up)){
              return true
            }
  
          }
          if(0 <= down &&  tab[x][down] != "lave" && !this.caseUsed[x][down]){
            if(this.search(tab, tile, x, down)){
              return true
            }
          }
        }

    },
    animate: function() {
        requestAnimationFrame(this.animate);
        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera);
    },


  },
  mounted() {
      this.init();
      this.animate();
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