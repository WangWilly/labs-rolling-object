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
        this.scene.background = new THREE.Color(0x0d0704);
        this.scene.fog = new THREE.Fog(0x0d0704, 5, 15);
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
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
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
        // Main golden light from above
        const mainLight = new THREE.DirectionalLight(0xd4af37, 1.5);
        mainLight.position.set(0, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        this.scene.add(mainLight);

        // Ambient warm glow
        const ambientLight = new THREE.AmbientLight(0xfff4e6, 0.3);
        this.scene.add(ambientLight);

        // Rim lighting
        const rimLight1 = new THREE.DirectionalLight(0xffebcd, 0.8);
        rimLight1.position.set(-5, 3, -3);
        this.scene.add(rimLight1);

        const rimLight2 = new THREE.DirectionalLight(0xffd700, 0.6);
        rimLight2.position.set(5, 2, 3);
        this.scene.add(rimLight2);

        // Point light for mystical glow
        const pointLight = new THREE.PointLight(0xd4af37, 1, 10);
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
        // Create a subtle ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2c1810,
            transparent: true,
            opacity: 0.5
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
        // Create floating lotus petals
        for (let i = 0; i < 20; i++) {
            const petalGeometry = new THREE.SphereGeometry(0.1, 8, 6);
            const petalMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xd4af37,
                transparent: true,
                opacity: 0.3,
                emissive: 0xd4af37,
                emissiveIntensity: 0.1
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
        // Create floating light particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;     // x
            positions[i + 1] = Math.random() * 10;         // y
            positions[i + 2] = (Math.random() - 0.5) * 20; // z
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xd4af37,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        this.backgroundParticles = particles;
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
