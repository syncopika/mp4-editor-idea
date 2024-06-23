// utils for mp4 editor

const imageFilterUtils = {
  invertImage: function(imgData){
    const d = imgData.data;
    let r, g, b, x, y, z;
    for(let i = 0; i < d.length; i += 4){
      r = d[i];
      g = d[i + 1];
      b = d[i + 2];
      d[i] = 255 - r;
      d[i + 1] = 255 - g;
      d[i + 2] = 255 - b;
    }
  },
  edgeDetection: function(imgData){
    const width = imgData.width;
    const height = imgData.height;
    const data = imgData.data;

    const sourceImageCopy = new Uint8ClampedArray(data);

    const xKernel = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const yKernel = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for(let i = 1; i < height - 1; i++){
      for(let j = 4; j < 4 * width - 4; j += 4){
        const left = (4 * i * width) + (j - 4);
        const right = (4 * i * width) + (j + 4);
        const top = (4 * (i - 1) * width) + j;
        const bottom = (4 * (i + 1) * width) + j;
        const topLeft = (4 * (i - 1) * width) + (j - 4);
        const topRight = (4 * (i - 1) * width) + (j + 4);
        const bottomLeft = (4 * (i + 1) * width) + (j - 4);
        const bottomRight = (4 * (i + 1) * width) + (j + 4);
        const center = (4 * width * i) + j;

        // use the xKernel to detect edges horizontally 
        const pX = (xKernel[0][0] * sourceImageCopy[topLeft]) + (xKernel[0][1] * sourceImageCopy[top]) + (xKernel[0][2] * sourceImageCopy[topRight]) +
                   (xKernel[1][0] * sourceImageCopy[left]) + (xKernel[1][1] * sourceImageCopy[center]) + (xKernel[1][2] * sourceImageCopy[right]) +
                   (xKernel[2][0] * sourceImageCopy[bottomLeft]) + (xKernel[2][1] * sourceImageCopy[bottom]) + (xKernel[2][2] * sourceImageCopy[bottomRight]);

        // use the yKernel to detect edges vertically 
        const pY = (yKernel[0][0] * sourceImageCopy[topLeft]) + (yKernel[0][1] * sourceImageCopy[top]) + (yKernel[0][2] * sourceImageCopy[topRight]) +
                   (yKernel[1][0] * sourceImageCopy[left]) + (yKernel[1][1] * sourceImageCopy[center]) + (yKernel[1][2] * sourceImageCopy[right]) +
                   (yKernel[2][0] * sourceImageCopy[bottomLeft]) + (yKernel[2][1] * sourceImageCopy[bottom]) + (yKernel[2][2] * sourceImageCopy[bottomRight]);

        // finally set the current pixel to the new value based on the formula 
        const newVal = (Math.ceil(Math.sqrt((pX * pX) + (pY * pY))));
        data[center] = newVal;
        data[center + 1] = newVal;
        data[center + 2] = newVal;
        data[center + 3] = 255;
      }
    }
  },
};

class CanvasUtils {
  constructor(){
    this.lastX = -1;
    this.lastY = -1;
    this.brushColor = '#000',
    this.brushWidth = 3;
    this.isMovingBrush = false;
  }
  
  prepCanvas(canvas){
    console.log('prepping canvas...');
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // add grey background behind selected canvas element
    // clicking on this background will turn off drawing for the selected canvas
    const bg = document.createElement('div');
    bg.style.position = 'absolute';
    bg.style.backgroundColor = '#ddd';
    bg.style.top = 0;
    bg.style.left = 0;
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.opacity = 0.8;
    
    bg.addEventListener('click', () => {
      const check = confirm("are you sure you're done drawing?");
      if(check){
        // remove drawing-related events from canvas
        canvas.removeEventListener('pointerdown', this.onBrushDown);
        canvas.removeEventListener('pointermove', this.onBrushMove);
        canvas.removeEventListener('pointerup', this.onBrushUp);
        
        // remove bg
        bg.parentNode.removeChild(bg);
        canvas.style.zIndex = 0;
        canvas.classList.add('canvas');
      }
    });
    
    canvas.classList.remove('canvas');
    canvas.style.zIndex = 100;
    document.body.appendChild(bg);
    
    // add drawing-related events to canvas
    canvas.addEventListener('pointerdown', this.onBrushDown.bind(this));
    canvas.addEventListener('pointermove', this.onBrushMove.bind(this));
    canvas.addEventListener('pointerup', this.onBrushUp.bind(this));
  }
  
  onBrushDown(evt){
    const target = evt.target.getBoundingClientRect();
    const x = evt.offsetX;
    const y = evt.offsetY;
    
    //console.log(`brush down @ (${x}, ${y})`);
    
    this.lastX = x;
    this.lastY = y;
    this.isMovingBrush = true;
  }
  
  onBrushMove(evt){
    if(this.isMovingBrush){
      const target = evt.target.getBoundingClientRect();
      const x = evt.offsetX;
      const y = evt.offsetY;
      
      this.ctx.strokeStyle = this.brushColor;
      this.ctx.lineWidth = this.brushWidth;
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.closePath();
      this.ctx.stroke();
      
      //console.log(`moving brush from (${this.lastX}, ${this.lastY}) to (${x}, ${y})`);
      
      this.lastX = x;
      this.lastY = y;
    }
  }
  
  onBrushUp(evt){
    //console.log('brush up');
    this.lastX = -1;
    this.lastY = -1;
    this.isMovingBrush = false;
  }
};
