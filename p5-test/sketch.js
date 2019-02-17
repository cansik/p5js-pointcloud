let pointCloudShader;
let vertices = [];
let vertexLength = 0;
let renderer;

let cam;

let gl;
let vertex_buffer;
let dataLoaded = false;
let shaderProgram;

function preload(){
  pointCloudShader = loadShader('shader/pointVertex.glsl', 'shader/pointColor.glsl');
}

function setup() {
  pixelDensity(1);
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);

  // fix for EasyCam to work with p5 v0.7.2
  Dw.EasyCam.prototype.apply = function(n) {
    var o = this.cam;
    n = n || o.renderer,
    n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
  };
  //cam = createEasyCam();

  // load pointcloud from file
  var client = new XMLHttpRequest();
  client.open('GET', 'bun_zipper_points.ply');
  client.onreadystatechange = function() {
    loadPointCloud(client.responseText);
  }
  client.send();

  gl = renderer.GL;
}

function draw() {
	//shader(pointCloudShader);
  //background(64);

  if(dataLoaded)
  {
    renderCloud();
  }
}

function renderCloud()
{
  gl.useProgram(shaderProgram);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coord);

  gl.clearColor(0.1, 0.1, 0.1, 0.9);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0 , renderer.width, renderer.height);

  gl.drawArrays(gl.POINTS, 0, vertexLength);
}

function displayHUD()
{
   //cam.beginHUD();
   var fps = frameRate();
   fill(255);
   stroke(0);
   textSize(20);
   text("FPS: " + fps.toFixed(2), 10, 10);
   //cam.endHUD();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
  cam.setViewport([0,0,windowWidth, windowHeight]);
}

function loadPointCloud(lines)
{
    let header = true;
    for (var i = 0; i < lines.length - 1; i++) {
      if(lines[i].includes("end_header"))
      {
        header = false;
        continue;
      }

      if(!header)
      {
        let data = lines[i].split(" ");

        let x = parseFloat(data[0]);
        let y = -parseFloat(data[1]);
        let z = parseFloat(data[2]);

        //vertices.push(new p5.Vector(x, y, z));

        if(x === NaN || y === NaN || z === NaN)
        {
          continue;
        }

        vertices.push(x);
        vertices.push(y);
        vertices.push(z);
      }
    }

    vertices = [
         -0.5,0.5,0.0,
         0.0,0.5,0.0,
         -0.25,0.25,0.0, ];

    vertexLength = vertices.length / 3;

    setupCloud();
}

function setupCloud()
{
  // create geometry
  vertex_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // create shader
  let vertCode =
    'attribute vec3 coordinates;' +

    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
       'gl_PointSize = 10.0;'+
    '}';

  let vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);

  let fragCode =
    'void main(void) {' +
       ' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
    '}';

  let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader); 
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  dataLoaded = true;
  console.log("data loaded: " + vertexLength + " points");
}



