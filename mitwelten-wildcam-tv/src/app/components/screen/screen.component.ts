import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription, filter, takeUntil, zip } from 'rxjs';
import { StackService } from '../../services/stack.service';
import { StackImage } from '../../shared/stack-image.type';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FreerunService } from '../../services/freerun.service';

const DEBUG = false;

class ResourceLoader {

  private subscription?: Subscription;
  private _target?: StackImage;
  private _image: HTMLImageElement = new Image();

  public complete: Subject<boolean> = new Subject();
  public dbg?: HTMLDivElement;

  constructor(
    private dataService: DataService,
    private images: HTMLImageElement[],
    public index: number,
  ) {
    this._image.addEventListener('load', () => {
      this.images[this.index] = this._image;
      if (DEBUG) this.dbg!.innerText = this.index.toString() + ' \n' + this._target?.object_name.substring(this._target?.object_name.lastIndexOf('/'));
      this.complete.next(true);
    });
    if (DEBUG) {
      this.dbg = document.createElement('div');
      this.dbg.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      this.dbg.style.padding = '10px';
      this.dbg.innerText = index.toString();
    }
  }

  load(target: StackImage) {
    this._target = target;
    if (this.subscription && !this.subscription.closed) {
      console.warn('cancelling previous loader', 'this.subscription.unsubscribe();');
      this.subscription.unsubscribe();
    }
    if (this._target) this.subscription = this.dataService.getImageResource(this._target.object_name).subscribe({
      next: (blob) => {
        if (this._image.src) URL.revokeObjectURL(this._image.src);
        this._image.src = URL.createObjectURL(blob);
      }
    });
  }

  public get target() {
    return this._target;
  }

  public get image() {
    return this._image;
  }

}

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

  @ViewChild('countdown')
  countdown?: ElementRef<HTMLDivElement>;

  private preLoadCount = 10;
  private initialised = false;
  private stackChanged = true;
  /** Framerate: still-images per second (render framerate is always 60fps */
  private framerate = 1;
  private landscape = true;
  private destroy = new Subject();
  private stack: StackImage[] = []; // urls / meta info for all images in selection
  private loaders: ResourceLoader[] = [];
  private images: HTMLImageElement[] = []; // the image preload / display stack

  public currentImage = {object_name: '', time: ''};

  constructor(
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    private stackService: StackService,
    private freeRunService: FreerunService,
  ) {
    this.cd.detach();
    for (let i = 0; i < this.preLoadCount; i++) {
      this.loaders.push(new ResourceLoader(dataService, this.images, i));
    }
  }

  ngOnInit(): void {
    this.stackService.framerate.pipe(
      takeUntil(this.destroy),
    ).subscribe(framerate => {
      this.framerate = framerate;
    });
    this.stackService.landscape.pipe(
      takeUntil(this.destroy),
    ).subscribe(landscape => {
      this.landscape = landscape;
    });
  }

  ngAfterViewInit(): void {
    // try later: maybe move the array into the stack service, instead of storing in this.stack
    this.stackService.stack.pipe(
      takeUntil(this.destroy),
      filter(stack => stack.length > 0),
    ).subscribe((stack) => {
      this.stack = stack;
      if (DEBUG) console.log('stack changed', stack[0].time, stack[stack.length-1].time);
      this.stackChanged = true;
      // this.glFrames = this.stack.length; // bring this back once testing is done, stack is subject to change

      if (!this.initialised) {
        const initIndex = 0;
        for (let i = 0; i < this.preLoadCount; i++) {
          let fi = i + initIndex; // fetchIndex
          if (fi < 0) fi = 0;
          if (fi >= this.stack.length-1) fi = this.stack.length-1;
          this.loaders[i].load(this.stack[fi]);
        }
      }
      const collective = zip(...this.loaders.map(rl => rl.complete)).subscribe(() => {
        collective.unsubscribe();
        if (DEBUG) {
          // debug view for preloaded images
          for (let i of this.images) {
            document.getElementById('dbgimg')?.appendChild(i)
          }
          for (let l of this.loaders) {
            document.getElementById('dbgtbl')?.appendChild(l.dbg!);
          }
        }
        // initialise WebGL context
        this.ngZone.runOutsideAngular(() => {
          if (!this.initialised) this.initContext();
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
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
    const u_rotate_location = gl.getUniformLocation(prg, 'u_rotate');
    const u_scale_location = gl.getUniformLocation(prg, 'u_scale');
    const u_offset_location = gl.getUniformLocation(prg, 'u_offset');

    gl.uniform1i(u_texture_0_location, 0);
    gl.uniform1i(u_texture_1_location, 1);
    gl.uniform1f(u_progress_location, 0.);
    gl.uniform1f(u_contrast_location, 0.);
    gl.uniform1f(u_rotate_location, this.landscape ? 0.0 : 1.0);
    gl.uniform1f(u_scale_location, Math.pow(1917 / 1440, 2)); // approx (16/9)^2
    gl.uniform1f(u_offset_location, 1 - (1 / Math.pow(1917 / 1440, 2))); // = 1 - 1/u_scale, offset to upper edge

    /** previous pos_1 */
    let last_pos_1 = -1;

    let fade = 0;
    let glFrame = 0;
    /** countdown for switch to new stack */
    let reloadDelta = 0;
    /** shift fetchIndex (needed when switching to new stack) */
    let readOffset = 0;
    // let startTime: number|undefined = undefined;

    const loadTexture = (index: number, image: HTMLImageElement) => {
      if (gl === undefined) throw new Error('no gl context');
      gl.bindTexture(gl.TEXTURE_2D, textures[index]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    const render = (time: number) => {
      if (this.stackChanged) { // reset animation when new stack is loaded
        // startTime = undefined;
        if (this.initialised) {
          reloadDelta = 10;
          this.freeRunService.pauseCountdown();
        }
        else this.initialised = true;
        this.stackChanged = false;
        gl.uniform1f(u_rotate_location, this.landscape ? 0.0 : 1.0);
      }
      // if (startTime === undefined) startTime = time;
      // const progress = (time - startTime) / 250.; // test with time instead of frame
      const progress = glFrame / 60.;
      const progress_int = Math.floor(progress);
      fade = progress % 1.;

      /** current position in loaders */
      const pos_1 = (progress_int + 0) % 10;
      /** fade to this position in loaders */
      const pos_2 = (progress_int + 1) % 10;
      /** loading to this position in loaders */
      const load  = (progress_int + 9) % 10;

      if (pos_1 !== last_pos_1 && this.stack.length) {
        if (DEBUG) console.log(`---\tpos_1:\t${pos_1},\tprogress:\t${progress_int},\tsl:\t${this.stack.length},\trd:\t${reloadDelta}`);
        if (reloadDelta > 0) {
          if (reloadDelta === 10) readOffset = (progress_int + 9);
          if (reloadDelta === 1) {
            if (DEBUG) console.log(`\tswitch stack`);
            this.freeRunService.resetCountdown((this.stack.length - 10) / this.framerate); // schedule switch at loop point
            this.freeRunService.resumeCountdown();
          }
          if (DEBUG) console.log(`\tl: ${load},\t1: ${pos_1},\t2: ${pos_2},\tro: ${readOffset}`);
          reloadDelta--;
          if (this.countdown) {
            if (reloadDelta > 0) {
              this.countdown.nativeElement.innerText = `${reloadDelta - 1}`;
              this.countdown.nativeElement.style.display = 'block';
              this.countdown.nativeElement.style.width = `${10 * (11 - reloadDelta)}%`;
            } else {
              this.countdown.nativeElement.style.display = 'none';
            }
          }
        }
        if (DEBUG) console.log(`\tpos_1:\t${pos_1},\tprogress:\t${progress_int},\tsl:\t${this.stack.length},\trd:\t${reloadDelta}`);
        // debug view for preloaded images
        if (DEBUG) this.loaders.forEach(rl => {
          rl.image.style.border = '4px solid black';
          if (rl.index === pos_1) rl.image.style.border = '4px solid red';
          if (rl.index === pos_2) rl.image.style.border = '4px solid orange';
          if (rl.index === load) rl.image.style.border = '4px solid green';
        });

        last_pos_1 = pos_1;

        const i_r_stack = ((progress_int + 9) - readOffset) % this.stack.length;
        if (!i_r_stack && DEBUG) console.log("loop condition", progress_int, readOffset, i_r_stack);
        if (DEBUG) console.log(`\tstack ${i_r_stack} -> loader ${load}`);
        this.loaders[load].load(this.stack[i_r_stack]);

        loadTexture(0, this.images[pos_1]);
        loadTexture(1, this.images[pos_2]);

        if (this.loaders[pos_1].target) {
          if (DEBUG) this.currentImage.object_name = this.loaders[pos_1].target!.object_name;
          this.currentImage.time = this.loaders[pos_1].target!.time;
        }
        this.cd.detectChanges();
      }

      gl.uniform1f(u_progress_location, fade);
      // gl.uniform1f(u_contrast_location, Math.cos(progress/1000.) * 2.);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
      // TODO: adjust framerate based on delta to next image
      glFrame += this.framerate;
    };
    requestAnimationFrame(render);
  }
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texture_coordinate;

uniform float u_rotate;
uniform float u_scale;
uniform float u_offset;

varying vec2 v_texture_coordinate;

void main() {
  vec2 position = a_position;
  if(u_rotate > 0.5) { // assuming 1.0 for true, 0.0 for false
    // offset and scale to fit rotated image
    position = vec2(-a_position.y, (a_position.x-u_offset) * u_scale);
  }
  gl_Position = vec4(position, 0.0, 1.0);
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

float s_curve(float t) {
  return t * t * (3.0 - 2.0 * t);
}

float inverted_s_curve(float t) {
  return 0.5 + 4.0 * (t - 0.5) * (t - 0.5) * (t - 0.5);
}

float tan_s_curve(float t) {
  return 0.5 + tan(2.0 * t - 1.0) / 3.0;
}

void main() {
  vec4 a = texture2D(u_texture_0, v_texture_coordinate);
  vec4 b = texture2D(u_texture_1, v_texture_coordinate);

  float t = tan_s_curve(u_progress);
  vec3 color = mix(a, b, t).rgb;

  gl_FragColor = vec4(0.5 + (1.0 + u_contrast) * (color - 0.5), 1.0);
}
`;
