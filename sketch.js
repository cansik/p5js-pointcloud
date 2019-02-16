let pointCloudShader;
let vertices = [];
let renderer;

let cam;

let cloud = null;
let gid = "cloud";

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
  cam = createEasyCam();

  loadStrings("bun_zipper_points.ply", loadPointCloud);
}

function draw() {
	//shader(pointCloudShader);
  background(64);
  fill(255);

  strokeWeight(0.1);
  stroke(255);

  // render points
  //translate(0, 250, 0);
  //scale(2500);
  /*
  for(var i = 0; i < vertices.length; i += 15)
  {
    let v = vertices[i];
      point(v.x, v.y, v.z);
  }
  */

  /*
  renderer._usePointShader();
  renderer.curPointShader.bindShader();

  renderer._drawPoints(vertices, renderer._pointVertexBuffer);

  renderer.curPointShader.unbindShader();
  */

  //displayHUD();
  if(cloud != null)
  {
    renderer.createBuffers(gid, cloud);
    renderer.drawBuffers(gid);
  }
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
    for (var i = 0; i < lines.length; i++) {
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

        vertices.push(new p5.Vector(x, y, z));
      }
    }

    cloud = box(100);
    
    // create cloud
    /*
    cloud = beginShape(POINTS);
    for(var i = 0; i < vertices.length; i += 15)
    {
        cloud.vertex(vertices[i].x, vertices[i].y, vertices[i].z);
    }
    cloud.endShape();
    */
}



