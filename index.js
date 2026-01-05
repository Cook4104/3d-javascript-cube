const ctx = mainCanvas.getContext("2d")

let WIDTH;
let HEIGHT;
let ASPECT;
let FOV = 90.0 * (Math.PI/180);

window.onload = window.onresize = function(){
  
  mainCanvas.width = window.innerWidth;
  mainCanvas.height = window.innerHeight;

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  ASPECT = WIDTH/HEIGHT;
}

const SQUARE_SIZE = 5
const HALF_SQUARE_SIZE = SQUARE_SIZE/2

function transform(position,transZ,angleX,angleY){
    const cosA = Math.cos(angleX);
    const sinA = Math.sin(angleX);


    const cosB = Math.cos(angleY);
    const sinB = Math.sin(angleY);
    
    const x = position.x;
    const y = position.y;
    const z = position.z;

   //newX = vert.x * Math.cos(angleY) + vert.z * Math.sin(angleY)
   //newY = vert.y
   //newZ = -vert.x * Math.sin(angleY) + vert.z * Math.cos(angleY)

  //newX = x * cosB + z * sinB
  //newY = y
  //newZ = -x * sinB + z*cosB


   newX = (x*cosB)+(z*sinB);
   newY = (x*sinA*sinB)+(y*cosA)-(z*sinA*cosB);
   newZ = -(x*cosA*sinB)+(y*sinA)+(z*cosA*cosB);

  return {x:newX,y:newY,z:newZ + transZ}
}

verts = [
  {x:-.5,y:-.5,z:-.5}, //back faces
  {x: .5,y:-.5,z:-.5},
  {x:-.5,y: .5,z:-.5},
  {x: .5,y: .5,z:-.5},


  {x:-.5,y:-.5,z:.5}, //front faces
  {x: .5,y:-.5,z:.5},
  {x:-.5,y: .5,z:.5},
  {x: .5,y: .5,z:.5},
]

lineIndices = [
  0,1,
  1,3,
  3,2,
  2,0,
  
  0,4,
  1,5,
  2,6,
  3,7,

  4,5,
  5,7,
  7,6,
  6,4
]

function clearScreen(){
  ctx.fillStyle = "black"
  ctx.fillRect(0,0,WIDTH,HEIGHT)
}

function renderSquare({x,y}){
  ctx.fillStyle = "green"
  ctx.fillRect(x-HALF_SQUARE_SIZE,y-HALF_SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE)
}

function renderLine({x:x1,y:y1},{x:x2,y:y2}){
  ctx.beginPath()
  ctx.moveTo(x1,y1)
  ctx.lineTo(x2,y2)
  ctx.strokeStyle = "green"
  ctx.stroke()
}

function renderSquareInWorld({x,y,z}){
  halfFov = FOV*0.5;
  xProj = x * (1/ASPECT*Math.tan(halfFov));
  yProj = y * (1/Math.tan(halfFov))

  xProj /= z;
  yProj /= z;

  xPixel = (xProj+1)*.5
  yPixel = 1-((yProj+1)*.5)
  xPixel *= WIDTH
  yPixel *= HEIGHT
  renderSquare({x:xPixel,y:yPixel})

}

function renderLineInWorld({x:x1,y:y1,z:z1},{x:x2,y:y2,z:z2}){
  halfFov = FOV*0.5;

  xProj1 = x1 * (1/ASPECT*Math.tan(halfFov));
  yProj1 = y1 * (1/Math.tan(halfFov))


  xProj1 /= z1;
  yProj1 /= z1;

  xPixel1 = (xProj1+1)*.5
  yPixel1 = 1-((yProj1+1)*.5)
  xPixel1 *= WIDTH
  yPixel1 *= HEIGHT
  

  xProj2 = x2 * (1/ASPECT*Math.tan(halfFov));
  yProj2 = y2 * (1/Math.tan(halfFov))
  
  xProj2 /= z2;
  yProj2 /= z2;

  xPixel2 = (xProj2+1)*.5
  yPixel2 = 1-((yProj2+1)*.5)
  xPixel2 *= WIDTH
  yPixel2 *= HEIGHT
  
  renderLine({x:xPixel1,y:yPixel1},{x:xPixel2,y:yPixel2})
}
function renderVerts(arr,transZ,angleX,angleY){
  for (let i = 0; i < arr.length; i++) {
    const vert = arr[i];

    var transformed = transform(vert,transZ,angleX,angleY)

    //renderSquareInWorld({x:newX,y:newY,z:newZ + transZ})
    renderSquareInWorld(transformed)
  }
}

function renderIndices(arrVert,arrInd,transZ,angleX,angleY){
  for(let i = 0;i < arrInd.length;i+=2){
    const p1 = arrVert[arrInd[i]]
    const p2 = arrVert[arrInd[i+1]]

    const t1 = transform(p1,transZ,angleX,angleY)
    const t2 = transform(p2,transZ,angleX,angleY)

    renderLineInWorld(t1,t2)
  }
}

time=0
function mainLoop(){
  time += 1/60
  clearScreen()

//  renderLineInWorld({x:0,y:0,z:1},{x:0.5,y:0.5,z:1})
  renderVerts(verts,2,time,time)
  renderIndices(verts,lineIndices,2,time,time);
  setTimeout(() => {requestAnimationFrame(mainLoop)}
  ,1/60)
}

mainLoop()
