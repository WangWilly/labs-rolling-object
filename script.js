// Sacred Buddha Pendant Scene
class BuddhaScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.buddhaModel = null;
        this.isRotating = true;
        this.lightMode = 0; // 0: sacred, 1: warm, 2: mystical
        this.rotationSpeed = 0.005;
        this.particles = [];
        this.thaiScriptures = [];
        
        // Thai characters for Matrix effect
        this.thaiChars = [
            'ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ญ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ',
            'ะ', 'ั', 'า', 'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ', 'ๅ', 'ๆ', '็', '่', '้', '๊', '๋', '์',
            '๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'
        ];
        
        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLighting();
        this.createEnvironment();
        this.createParticles();
        this.createThaiScriptures();
        this.loadModel();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading after a short delay
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 2000);
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1200); // More yellow-tinted dark background
        this.scene.fog = new THREE.Fog(0x1a1200, 5, 15);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: this.isMobile() ? false : true, // Disable antialiasing on mobile for performance
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Optimize pixel ratio for mobile devices
        const pixelRatio = this.isMobile() ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
        this.renderer.setPixelRatio(pixelRatio);
        
        this.renderer.shadowMap.enabled = !this.isMobile(); // Disable shadows on mobile for performance
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 10;
        this.controls.minDistance = 2;
        this.controls.maxPolarAngle = Math.PI * 0.8;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 0.5;
        
        // Mobile-specific touch controls
        if (this.isMobile()) {
            this.controls.enablePan = true;
            this.controls.panSpeed = 0.8;
            this.controls.rotateSpeed = 0.8;
            this.controls.zoomSpeed = 1.2;
            this.controls.touches = {
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
            };
        }
    }

    isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    createLighting() {
        // Remove existing lights
        this.scene.children = this.scene.children.filter(child => 
            !(child instanceof THREE.Light)
        );

        switch(this.lightMode) {
            case 0: // Sacred golden lighting
                this.createSacredLighting();
                break;
            case 1: // Warm temple lighting
                this.createWarmLighting();
                break;
            case 2: // Mystical blue lighting
                this.createMysticalLighting();
                break;
        }
    }

    createSacredLighting() {
        // Main golden light from above - more intense yellow
        const mainLight = new THREE.DirectionalLight(0xffcc00, 2.0);
        mainLight.position.set(0, 10, 5);
        
        // Only enable shadows on desktop for performance
        if (!this.isMobile()) {
            mainLight.castShadow = true;
            mainLight.shadow.mapSize.width = 2048;
            mainLight.shadow.mapSize.height = 2048;
            mainLight.shadow.camera.near = 0.5;
            mainLight.shadow.camera.far = 50;
        }
        
        this.scene.add(mainLight);

        // Ambient warm golden glow
        const ambientLight = new THREE.AmbientLight(0xffd700, 0.5);
        this.scene.add(ambientLight);

        // Reduce rim lights on mobile for performance
        if (!this.isMobile()) {
            const rimLight1 = new THREE.DirectionalLight(0xffaa00, 1.0);
            rimLight1.position.set(-5, 3, -3);
            this.scene.add(rimLight1);

            const rimLight2 = new THREE.DirectionalLight(0xffd700, 0.8);
            rimLight2.position.set(5, 2, 3);
            this.scene.add(rimLight2);
        }

        // Point light for mystical golden glow
        const pointLight = new THREE.PointLight(0xffcc00, 1.5, 10);
        pointLight.position.set(0, 3, 0);
        this.scene.add(pointLight);
    }

    createWarmLighting() {
        const mainLight = new THREE.DirectionalLight(0xff7f50, 1.2);
        mainLight.position.set(3, 8, 3);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const ambientLight = new THREE.AmbientLight(0xffa500, 0.4);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff6347, 0.8, 8);
        pointLight.position.set(-3, 2, 2);
        this.scene.add(pointLight);
    }

    createMysticalLighting() {
        const mainLight = new THREE.DirectionalLight(0x4169e1, 1.3);
        mainLight.position.set(0, 8, 3);
        mainLight.castShadow = true;
        this.scene.add(mainLight);

        const ambientLight = new THREE.AmbientLight(0x191970, 0.3);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00bfff, 1, 10);
        pointLight1.position.set(3, 3, 3);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x9370db, 0.8, 8);
        pointLight2.position.set(-3, 2, -2);
        this.scene.add(pointLight2);
    }

    createEnvironment() {
        // Create a subtle ground plane - more golden
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3d2b00, // Golden brown ground
            transparent: true,
            opacity: 0.6
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add ethereal background elements
        this.createBackgroundElements();
    }

    createBackgroundElements() {
        // Create floating lotus petals - fewer on mobile for performance
        const petalCount = this.isMobile() ? 10 : 20;
        
        for (let i = 0; i < petalCount; i++) {
            const petalGeometry = new THREE.SphereGeometry(0.1, 8, 6);
            const petalMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffcc00, // Bright golden color
                transparent: true,
                opacity: 0.4,
                emissive: 0xffaa00,
                emissiveIntensity: 0.2
            });
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            
            petal.position.set(
                (Math.random() - 0.5) * 15,
                Math.random() * 8 + 2,
                (Math.random() - 0.5) * 15
            );
            
            petal.userData = {
                speed: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 2 + 1
            };
            
            this.scene.add(petal);
            this.particles.push(petal);
        }
    }

    createParticles() {
        // Create floating light particles - fewer on mobile
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = this.isMobile() ? 50 : 100;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;     // x
            positions[i + 1] = Math.random() * 10;         // y
            positions[i + 2] = (Math.random() - 0.5) * 20; // z
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffcc00, // Bright golden particles
            size: this.isMobile() ? 0.06 : 0.08, // Smaller on mobile
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.backgroundParticles = particles;
    }

    createThaiScriptures() {
        // Optimize for mobile performance - fewer columns and shorter streams
        const columnCount = this.isMobile() ? 15 : 25;
        const columnWidth = 40 / columnCount; // Spread across 40 units width

        for (let col = 0; col < columnCount; col++) {
            // Each column has multiple falling character streams
            const streamsPerColumn = this.isMobile() ? 
                Math.floor(Math.random() * 2) + 1 : // 1-2 streams per column on mobile
                Math.floor(Math.random() * 3) + 2; // 2-4 streams per column on desktop
            
            for (let stream = 0; stream < streamsPerColumn; stream++) {
                // Create a stream of characters (shorter on mobile)
                const streamLength = this.isMobile() ? 
                    Math.floor(Math.random() * 5) + 5 : // 5-9 characters on mobile
                    Math.floor(Math.random() * 8) + 8; // 8-15 characters on desktop
                
                const streamChars = [];
                
                for (let i = 0; i < streamLength; i++) {
                    streamChars.push(this.thaiChars[Math.floor(Math.random() * this.thaiChars.length)]);
                }

                // Create canvas for the entire character stream
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                
                // Optimize canvas size for mobile
                const canvasWidth = this.isMobile() ? 48 : 64;
                const charHeight = this.isMobile() ? 60 : 80;
                
                canvas.width = canvasWidth;
                canvas.height = streamLength * charHeight;

                // Set text style
                const fontSize = this.isMobile() ? 24 : 32;
                context.font = `bold ${fontSize}px "Noto Sans Thai", Arial, sans-serif`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';

                // Draw each character with Matrix-like gradient effect
                for (let i = 0; i < streamChars.length; i++) {
                    const charY = (i + 0.5) * charHeight;
                    
                    // Create fade effect - brightest at the bottom (head of stream)
                    const intensity = (streamChars.length - i) / streamChars.length;
                    const alpha = Math.pow(intensity, 1.5) * 0.9;
                    
                    // Golden Matrix effect with glow (reduced on mobile)
                    const shadowBlur = this.isMobile() ? 4 : 8;
                    context.shadowColor = `rgba(255, 204, 0, ${alpha * 0.8})`;
                    context.shadowBlur = shadowBlur;
                    context.fillStyle = `rgba(255, 204, 0, ${alpha})`;
                    
                    context.fillText(streamChars[i], canvas.width / 2, charY);
                }

                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);
                texture.needsUpdate = true;

                // Create material with additive blending for glow effect
                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 1.0,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                });

                // Create geometry - tall and narrow like Matrix columns
                const geometry = new THREE.PlaneGeometry(1, streamLength * 1.2);
                const streamMesh = new THREE.Mesh(geometry, material);

                // Position in columns across the scene
                const xPos = (col - columnCount / 2) * columnWidth + (Math.random() - 0.5) * 2;
                const startY = Math.random() * 10 + 20; // Start high above
                const zPos = (Math.random() - 0.5) * 30; // Spread in depth

                streamMesh.position.set(xPos, startY, zPos);

                // Always face the camera for billboard effect
                streamMesh.lookAt(this.camera.position);

                // Store Matrix-style falling data
                streamMesh.userData = {
                    fallSpeed: Math.random() * 0.05 + 0.03, // Faster falling like Matrix
                    originalChars: streamChars,
                    changeSpeed: Math.random() * 0.1 + 0.05, // Character change frequency
                    lastChangeTime: 0,
                    streamLength: streamLength,
                    column: col,
                    resetHeight: Math.random() * 10 + 20,
                    canvas: canvas,
                    context: context,
                    texture: texture,
                    charHeight: charHeight,
                    fontSize: fontSize
                };

                this.scene.add(streamMesh);
                this.thaiScriptures.push(streamMesh);
            }
        }
    }

    loadModel() {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            './pra1_Model_4_0000000.glb',
            (gltf) => {
                this.buddhaModel = gltf.scene;
                
                // Scale and position the model
                const box = new THREE.Box3().setFromObject(this.buddhaModel);
                const size = box.getSize(new THREE.Vector3()).length();
                const center = box.getCenter(new THREE.Vector3());
                
                // Scale to fit nicely in view
                const desiredSize = 3;
                const scale = desiredSize / size;
                this.buddhaModel.scale.setScalar(scale);
                
                // Center the model
                this.buddhaModel.position.copy(center.multiplyScalar(-scale));
                this.buddhaModel.position.y += 1;
                
                // Enable shadows
                this.buddhaModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // Enhance material for better appearance
                        if (child.material) {
                            child.material.roughness = 0.3;
                            child.material.metalness = 0.1;
                        }
                    }
                });
                
                this.scene.add(this.buddhaModel);
                console.log('Buddha model loaded successfully');
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
                document.getElementById('loading').innerHTML = 
                    '<div class="spinner"></div><p>Error loading model. Please check the file path.</p>';
            }
        );
    }

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('playPause').addEventListener('click', () => {
            this.isRotating = !this.isRotating;
            const button = document.getElementById('playPause');
            button.textContent = this.isRotating ? '⏸️ Pause' : '▶️ Play';
        });

        // Reset button
        document.getElementById('reset').addEventListener('click', () => {
            if (this.buddhaModel) {
                this.buddhaModel.rotation.set(0, 0, 0);
            }
            this.camera.position.set(0, 2, 5);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });

        // Lighting toggle
        document.getElementById('lighting').addEventListener('click', () => {
            this.lightMode = (this.lightMode + 1) % 3;
            this.createLighting();
            
            const modes = ['Sacred', 'Warm', 'Mystical'];
            const button = document.getElementById('lighting');
            button.textContent = `💡 ${modes[this.lightMode]}`;
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate the Buddha model
        if (this.buddhaModel && this.isRotating) {
            this.buddhaModel.rotation.y += this.rotationSpeed;
        }

        // Animate floating elements
        this.particles.forEach((particle) => {
            particle.position.y += Math.sin(Date.now() * particle.userData.speed) * 0.01;
            particle.rotation.y += 0.01;
        });

        // Animate background particles
        if (this.backgroundParticles) {
            this.backgroundParticles.rotation.y += 0.001;
        }

        // Animate falling Thai scriptures (Matrix style)
        this.thaiScriptures.forEach((script) => {
            const currentTime = Date.now() * 0.001; // Convert to seconds
            
            // Fall down at Matrix speed
            script.position.y -= script.userData.fallSpeed;
            
            // Matrix-style character changing effect
            if (currentTime - script.userData.lastChangeTime > script.userData.changeSpeed) {
                script.userData.lastChangeTime = currentTime;
                
                // Randomly change some characters in the stream
                const changeCount = Math.floor(Math.random() * 3) + 1;
                for (let i = 0; i < changeCount; i++) {
                    const charIndex = Math.floor(Math.random() * script.userData.originalChars.length);
                    script.userData.originalChars[charIndex] = 
                        this.thaiChars[Math.floor(Math.random() * this.thaiChars.length)];
                }
                
                // Redraw the canvas with new characters
                const canvas = script.userData.canvas;
                const context = script.userData.context;
                const streamLength = script.userData.streamLength;
                
                // Clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // Redraw with updated characters and Matrix fade effect
                const fontSize = script.userData.fontSize || 32;
                const charHeight = script.userData.charHeight || 80;
                
                context.font = `bold ${fontSize}px "Noto Sans Thai", Arial, sans-serif`;
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                
                for (let i = 0; i < script.userData.originalChars.length; i++) {
                    const charY = (i + 0.5) * charHeight;
                    
                    // Matrix fade effect - brightest at bottom (head of stream)
                    const intensity = (streamLength - i) / streamLength;
                    const alpha = Math.pow(intensity, 1.5) * 0.9;
                    
                    // Add random brightness flicker for Matrix effect
                    const flicker = 0.8 + Math.random() * 0.2;
                    const finalAlpha = alpha * flicker;
                    
                    // Use mobile-optimized shadow blur
                    const shadowBlur = this.isMobile() ? 4 : 8;
                    context.shadowColor = `rgba(255, 204, 0, ${finalAlpha * 0.8})`;
                    context.shadowBlur = shadowBlur;
                    context.fillStyle = `rgba(255, 204, 0, ${finalAlpha})`;
                    
                    context.fillText(script.userData.originalChars[i], canvas.width / 2, charY);
                }
                
                // Update texture
                script.userData.texture.needsUpdate = true;
            }
            
            // Always face camera for billboard effect
            script.lookAt(this.camera.position);
            
            // Reset to top when it goes below ground (Matrix infinite loop)
            if (script.position.y < -script.userData.streamLength - 5) {
                script.position.y = script.userData.resetHeight;
                script.position.x = (script.userData.column - 12.5) * 1.6 + (Math.random() - 0.5) * 2;
                script.position.z = (Math.random() - 0.5) * 30;
                
                // Reset some characters for variety
                for (let i = 0; i < script.userData.originalChars.length; i++) {
                    if (Math.random() < 0.3) { // 30% chance to change each character
                        script.userData.originalChars[i] = 
                            this.thaiChars[Math.floor(Math.random() * this.thaiChars.length)];
                    }
                }
            }
        });

        // Update controls
        this.controls.update();

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the scene when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BuddhaScene();
});
