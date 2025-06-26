/**
 * Techno Lava Lamp Background
 * Creates an animated, shader-based techno lava lamp effect with geometric patterns
 */

class LavaLampBackground {
    constructor(options = {}) {
        // Default techno options
        this.options = Object.assign({
            colorA: new THREE.Color(0x0a0a0a), // Dark background
            colorB: new THREE.Color(0x00ffff), // Cyan
            colorC: new THREE.Color(0xff00ff), // Magenta
            colorD: new THREE.Color(0xffff00), // Yellow
            speed: 0.8,
            noiseScale: 2.0,
            noiseIntensity: 0.2,
            blobScale: 1.8,
            glitchIntensity: 0.1,
            gridSize: 8.0
        }, options);
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.uniforms = null;
        this.mesh = null;
        this.clock = new THREE.Clock();
        this.renderTarget = null; // Add render target for background
    }
    
    init(renderer) {
        this.renderer = renderer;
        
        // Create a separate scene and camera for the background
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        // Create render target for background texture
        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth, 
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        );
        
        // Define shader uniforms
        this.uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2() },
            u_colorA: { value: this.options.colorA },
            u_colorB: { value: this.options.colorB },
            u_colorC: { value: this.options.colorC },
            u_noiseScale: { value: this.options.noiseScale },
            u_noiseIntensity: { value: this.options.noiseIntensity },
            u_blobScale: { value: this.options.blobScale }
        };
        
        // Update resolution uniform
        this.uniforms.u_resolution.value.x = window.innerWidth * this.renderer.getPixelRatio();
        this.uniforms.u_resolution.value.y = window.innerHeight * this.renderer.getPixelRatio();
        
        // Create material with shaders
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            depthWrite: false,
            depthTest: false
        });
        
        // Create a full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // Setup resize listener
        window.addEventListener('resize', this.onResize.bind(this));
        
        console.log('LavaLampBackground initialized with options:', this.options);
        console.log('Shader material created:', material);
    }
    
    onResize() {
        if (!this.uniforms || !this.renderer) return;
        
        // Update resolution uniform
        this.uniforms.u_resolution.value.x = window.innerWidth * this.renderer.getPixelRatio();
        this.uniforms.u_resolution.value.y = window.innerHeight * this.renderer.getPixelRatio();
        
        // Resize render target
        if (this.renderTarget) {
            this.renderTarget.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    update() {
        if (!this.uniforms) {
            console.log('Lava background uniforms not available');
            return;
        }
        
        // Update time uniform
        this.uniforms.u_time.value = this.clock.getElapsedTime() * this.options.speed;
        
        // Render the background scene directly to canvas
        this.renderer.render(this.scene, this.camera);
    }
    
    getRenderTarget() {
        return this.renderTarget ? this.renderTarget.texture : null;
    }
    
    getVertexShader() {
        return `
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;
    }
    
    getFragmentShader() {
        return `
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec3 u_colorA;
            uniform vec3 u_colorB;
            uniform vec3 u_colorC;
            uniform float u_noiseScale;
            uniform float u_noiseIntensity;
            uniform float u_blobScale;
            
            varying vec2 vUv;
            
            void main() {
                // Simple test: animated gradient to verify the shader is working
                vec2 uv = vUv;
                
                // Create time-based animation
                float time = u_time * 0.5;
                
                // Simple gradient with animation
                vec3 color1 = u_colorA;
                vec3 color2 = u_colorB;
                vec3 color3 = u_colorC;
                
                // Animated gradient
                float gradient = sin(uv.x * 3.0 + time) * 0.5 + 0.5;
                float gradient2 = cos(uv.y * 3.0 + time * 0.7) * 0.5 + 0.5;
                
                vec3 color = mix(color1, color2, gradient);
                color = mix(color, color3, gradient2 * 0.5);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
    }
    
    // Clean up resources
    dispose() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        
        window.removeEventListener('resize', this.onResize.bind(this));
    }
}