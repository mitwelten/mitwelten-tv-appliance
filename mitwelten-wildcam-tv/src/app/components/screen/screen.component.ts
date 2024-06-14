import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { StackService } from '../../services/stack.service';
import { StackImage } from '../../shared/stack-image.type';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './screen.component.html',
  styleUrl: './screen.component.css'
})
export class ScreenComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('screen', {static: true})
  screen?: ElementRef<HTMLCanvasElement>;

  private preLoadCount = 10;
  private initialised = false;
  private destroy = new Subject();
  private stack: StackImage[] = []; // urls / meta info for all images in selection
  private loaders: Subscription[] = new Array(10);
  private images: HTMLImageElement[] = []; // the image preload / display stack

  public currentImage = {object_name: '', time: ''};

  constructor(
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    private stackService: StackService,
  ) {
    this.cd.detach();
    for (let i = 0; i < 10; i++) {
      const img = new Image();
      this.images.push(img);
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // try later: maybe move the array into the stack service, instead of storing in this.stack
    this.stackService.stack.pipe(takeUntil(this.destroy)).subscribe((stack) => {
      this.stack = stack;
      // this.glFrames = this.stack.length; // bring this back once testing is done, stack is subject to change

      const initIndex = 1;
      let preloaded = 0;
      for (let i = 0; i < this.preLoadCount; i++) {
        let fi = i + initIndex; // fetchIndex
        if (fi < 0) fi = 0;
        if (fi >= this.stack.length-1) fi = this.stack.length-1;
        this.loaders[fi] = this.loadImage(i, this.stack[fi].object_name).subscribe(complete => {
          preloaded++;
          if (preloaded === this.preLoadCount) {
            // debug view for preloaded images
            // for (let i of this.images) {
            //   document.getElementById('dbgimg')?.appendChild(i)
            // }
            // initialise WebGL context
            this.ngZone.runOutsideAngular(() => {
              if (!this.initialised) this.initContext();
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private loadImage(index: number, url: string) {
    return this.dataService.getImageResource(url).pipe(
      switchMap(blob => {
        // onload: one eventlistener, simple override
        return new Observable<number>(observer => {
          const blobUrl = URL.createObjectURL(blob);
          this.images[index].onload = () => {
            URL.revokeObjectURL(blobUrl); // TEST: remove this line
            observer.next(index);
            observer.complete();
          };
          this.images[index].src = blobUrl;
        });
      })
    );
  }

  private initContext(): void {
    if (this.screen === undefined) throw new Error('no canvas');
    const gl = this.screen.nativeElement.getContext('webgl');
    if (gl === null) throw new Error('no webgl context');

    // initialise textures
    const textures: WebGLTexture[] = [];
    for (let i = 0; i < 2; i++) {
      const texture = gl.createTexture();
      if (texture) {
        textures.push(texture)
        gl.activeTexture(i ? gl.TEXTURE1 : gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      else throw new Error('initialising textures failed');
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vertexShader)!)
    };

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fragmentShader)!)
    };

    const prg = gl.createProgram()!;
    gl.attachShader(prg, vertexShader);
    gl.attachShader(prg, fragmentShader);
    gl.linkProgram(prg);
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg)!)
    };

    // clip-space vertex coordinates
    // -1/-1 - 1/1
    const x1 = -1;
    const x2 = x1 + 2;
    const y1 = -1;
    const y2 = y1 + 2;
    const vertexCoordinates = new Float32Array([
        x1,y1 , x2,y1 , x1,y2 ,
        x2,y1 , x1,y2 , x2,y2 ,
    ]);

    // texture coordinates are not clip-space coordinates!
    // 0/0 - 1/1
    const textureCoordinates = new Float32Array([
        0,0 , 1,0 , 0,1 ,
        1,0 , 0,1 , 1,1 ,
    ]);

    const vertrexCoordinatesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertrexCoordinatesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexCoordinates, gl.STATIC_DRAW);

    const a_position_loc = gl.getAttribLocation(prg, 'a_position');
    gl.enableVertexAttribArray(a_position_loc);
    gl.vertexAttribPointer(
        a_position_loc,
        2,            // 2 values per vertex shader iteration
        gl.FLOAT,     // data is 32bit floats
        false,        // don't normalize
        0,            // stride (0 = auto)
        0,            // offset into buffer
    );

    const textureCoorinatesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoorinatesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

    const a_texture_coordinate_loc = gl.getAttribLocation(prg, 'a_texture_coordinate');
    gl.enableVertexAttribArray(a_texture_coordinate_loc);
    gl.vertexAttribPointer(a_texture_coordinate_loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prg);

    const u_texture_0_location = gl.getUniformLocation(prg, 'u_texture_0');
    const u_texture_1_location = gl.getUniformLocation(prg, 'u_texture_1');
    const u_progress_location = gl.getUniformLocation(prg, 'u_progress');
    const u_contrast_location = gl.getUniformLocation(prg, 'u_contrast');

    gl.uniform1i(u_texture_0_location, 0);
    gl.uniform1i(u_texture_1_location, 1);
    gl.uniform1f(u_progress_location, 0.);
    gl.uniform1f(u_contrast_location, 0.);

    let stackIndex = 0;
    let lastIndex = -1;
    let fetchIndex = 0;
    let fade = 0;
    let glFrame = 0;
    let startTime: number|undefined = undefined;

    const loadTexture = (index: number, image: HTMLImageElement) => {
      if (gl === undefined) throw new Error('no gl context');
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    const render = (time: number) => {
      if (startTime === undefined) startTime = time;
      // const progress = (time - startTime) / 250.; // test with time instead of frame
      const progress = glFrame / 30.;
      stackIndex = Math.floor(progress);
      fade = progress % 1.;
      const pos_1 = (stackIndex + 4) % 10;
      const pos_2 = (stackIndex + 5) % 10;
      const load  = (stackIndex + 9) % 10;

      if (stackIndex !== lastIndex && this.stack.length) {
        fetchIndex = stackIndex + 4;
        lastIndex = stackIndex;
        const loadIndex = load % 10;
        if (this.loaders[loadIndex] && !this.loaders[loadIndex].closed) {
          this.loaders[loadIndex].unsubscribe();
        }
        this.loaders[loadIndex] = this.loadImage(loadIndex, this.stack[fetchIndex].object_name).subscribe();
        loadTexture(0, this.images[pos_1]);
        loadTexture(1, this.images[pos_2]);

        this.currentImage.object_name = this.stack[stackIndex].object_name;
        this.currentImage.time = this.stack[stackIndex].time;
        this.cd.detectChanges();
      }

      gl.uniform1f(u_progress_location, fade);
      // gl.uniform1f(u_contrast_location, Math.cos(progress/1000.) * 2.);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
      glFrame++;
    };
    requestAnimationFrame(render);
  }
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texture_coordinate;

varying vec2 v_texture_coordinate;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texture_coordinate = a_texture_coordinate;
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 v_texture_coordinate;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;

uniform float u_progress;
uniform float u_contrast;

void main() {
  vec4 a = texture2D(u_texture_0, v_texture_coordinate);
  vec4 b = texture2D(u_texture_1, v_texture_coordinate);
  vec3 color = mix(a, b, u_progress).rgb;
  gl_FragColor = vec4(0.5 + (1.0 + u_contrast) * (color - 0.5), 1.0);
}
`;
