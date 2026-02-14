
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

console.log("Intro.js Loaded - Starting 3D Scene...");

// Configuration
const CONFIG = {
    colors: {
        background: 0x0B0F1A,
        neonBlue: 0x22D3EE,
        neonPurple: 0xA855F7,
        neonGreen: 0x34F5C5,
        grid: 0x1a2133
    },
    robotSpeed: 0.2, // Movement speed
    sections: [
        { name: "Dashboard", z: 20, color: 0x22D3EE },
        { name: "Skills", z: 40, color: 0xA855F7 },
        { name: "Roadmap", z: 60, color: 0x34F5C5 },
        { name: "Internships", z: 80, color: 0xFF6B00 },
        { name: "Resume", z: 100, color: 0xFF3D71 },
    ]
};

class IntroScene {
    constructor() {
        try {
            this.container = document.getElementById('canvas-container');
            if (!this.container) throw new Error("Canvas container not found");

            // Clear loading text
            this.container.innerHTML = '';

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(CONFIG.colors.background);
            this.scene.fog = new THREE.FogExp2(CONFIG.colors.background, 0.02);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            this.robot = null;
            this.keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
            this.velocity = new THREE.Vector3();
            this.CONFIG = CONFIG;
            this.unlockedSections = new Set(['Dashboard']); // Dashboard unlocked initially
            window.introScene = this;

            this.init();
            this.animate();
        } catch (e) {
            console.error("3D Init Error:", e);
            // Fallback: Show main app immediately if 3D fails
            document.querySelector('.app').style.display = 'flex';
            document.getElementById('canvas-container').style.display = 'none';
            document.getElementById('ui-layer').style.display = 'none';
        }
    }

    init() {
        // Renderer Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);

        // Grid
        const gridHelper = new THREE.GridHelper(200, 100, CONFIG.colors.neonBlue, CONFIG.colors.grid);
        gridHelper.position.y = -1;
        this.scene.add(gridHelper);

        // Stars/Particles
        this.createParticles();

        // Create Robot AND Camera position
        this.createRobot();

        // Initial Camera Position
        this.camera.position.set(0, 3, -5);
        this.camera.lookAt(0, 1, 5);

        // Create Sections
        this.createSections();

        // Create Side Panels
        this.createSidePanels();

        // Event Listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Mobile scroll controls
        let lastScrollY = 0;
        window.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > 50) {
                if (e.deltaY > 0) {
                    this.keys['ArrowDown'] = true;
                } else {
                    this.keys['ArrowUp'] = true;
                }
                setTimeout(() => {
                    this.keys['ArrowUp'] = false;
                    this.keys['ArrowDown'] = false;
                }, 100);
            }
        });

        // Touch swipe controls
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        window.addEventListener('touchmove', (e) => {
            const touchEndY = e.touches[0].clientY;
            const diff = touchStartY - touchEndY;
            if (Math.abs(diff) > 30) {
                if (diff > 0) {
                    this.keys['ArrowDown'] = true;
                } else {
                    this.keys['ArrowUp'] = true;
                }
            }
        });
        window.addEventListener('touchend', () => {
            this.keys['ArrowUp'] = false;
            this.keys['ArrowDown'] = false;
        });

        this.showToast("Use Arrow Keys to Move! ⬆️ ⬇️ (or swipe on mobile)");
    }

    createSidePanels() {
        const uiLayer = document.getElementById('ui-layer');
        if (!uiLayer) return;

        // Create left panel
        const leftPanel = document.createElement('div');
        leftPanel.id = 'left-sections-panel';
        leftPanel.className = 'sections-panel left-panel';
        uiLayer.appendChild(leftPanel);

        // Create right panel
        const rightPanel = document.createElement('div');
        rightPanel.id = 'right-sections-panel';
        rightPanel.className = 'sections-panel right-panel';
        uiLayer.appendChild(rightPanel);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 1000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 100,
                Math.random() * 20,
                (Math.random() - 0.5) * 200
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
    }

    createRobot() {
        this.robot = new THREE.Group();

        // Simple Robot Construction
        const bodyGeo = new THREE.BoxGeometry(1, 1.2, 0.8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x22D3EE, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1;
        this.robot.add(body);

        const headGeo = new THREE.BoxGeometry(0.8, 0.7, 0.8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 2.05;
        this.robot.add(head);

        // Eyes
        const eyeGeo = new THREE.BoxGeometry(0.2, 0.1, 0.1);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x34F5C5 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.2, 2.1, 0.41);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.2, 2.1, 0.41);
        this.robot.add(leftEye);
        this.robot.add(rightEye);

        this.scene.add(this.robot);
    }

    createSections() {
        CONFIG.sections.forEach(section => {
            const geometry = new THREE.TorusGeometry(3, 0.2, 16, 50);
            const material = new THREE.MeshBasicMaterial({ color: section.color });
            const torus = new THREE.Mesh(geometry, material);
            torus.position.set(0, 1.5, section.z);
            this.scene.add(torus);
            this.createSectionLabel(section);
        });
    }

    createSectionLabel(section) {
        const div = document.createElement('div');
        div.className = 'section-label';
        div.textContent = section.name;
        div.style.color = '#' + section.color.toString(16);
        div.dataset.z = section.z;
        div.style.opacity = '0';
        div.style.pointerEvents = 'none';
        const container = document.getElementById('labels-container');
        if (container) container.appendChild(div);
        section.domElement = div;
    }

    updateLabels() {
        CONFIG.sections.forEach(section => {
            if (!section.domElement || !this.robot) return;

            const dist = Math.abs(this.robot.position.z - section.z);
            const isApproaching = dist < 8;

            if (!isApproaching) {
                // Hide label if not approaching
                section.domElement.style.opacity = '0';
                section.domElement.style.pointerEvents = 'none';
                section.domElement.style.display = 'none';
                return;
            }

            // Show label when approaching
            section.domElement.style.opacity = '1';
            section.domElement.style.pointerEvents = 'auto';

            const vector = new THREE.Vector3(0, 4, section.z);
            vector.project(this.camera);

            const x = (vector.x * .5 + .5) * window.innerWidth;
            const y = (-(vector.y * .5) + .5) * window.innerHeight;

            if (vector.z > 1) {
                section.domElement.style.display = 'none';
            } else {
                section.domElement.style.display = 'block';
                section.domElement.style.left = `${x}px`;
                section.domElement.style.top = `${y}px`;
                section.domElement.style.transition = 'opacity 0.3s ease';

                if (dist < 4) this.showInteractButton(section);
            }
        });

        // Update side sections display
        this.updateSideSections();
    }

    updateSideSections() {
        const leftPanel = document.getElementById('left-sections-panel');
        const rightPanel = document.getElementById('right-sections-panel');
        
        if (!leftPanel || !rightPanel || !this.robot) return;

        let leftHTML = '<div class="side-header">← Destinations</div>';
        let rightHTML = '<div class="side-header">Destinations →</div>';
        let leftCount = 0;
        let rightCount = 0;

        CONFIG.sections.forEach(section => {
            const dist = this.robot.position.z - section.z;
            const distAbs = Math.abs(dist);
            const isArrived = distAbs < 2;

            // Only show sections when robot has arrived at them
            if (isArrived) {
                const colorHex = section.color.toString(16).padStart(6, '0');
                const sectionHTML = `
                    <div class="side-section-item near" 
                         data-section="${section.name}" 
                         style="border-color: #${colorHex}; --section-color: #${colorHex};"
                         onclick="window.introScene.enterSection(window.introScene.CONFIG.sections.find(s => s.name === '${section.name}'))">
                        <div class="section-dot" style="background-color: #${colorHex};"></div>
                        <span class="section-name">${section.name}</span>
                        <span class="distance-indicator">✓ READY</span>
                    </div>
                `;

                if (dist < 0) {
                    // Already passed - show on left
                    leftHTML += sectionHTML;
                    leftCount++;
                } else {
                    // Currently at or arriving - show on right
                    rightHTML += sectionHTML;
                    rightCount++;
                }
            }
        });

        leftPanel.innerHTML = leftHTML;
        rightPanel.innerHTML = rightHTML;
        
        // Show/hide panels only when sections are available
        leftPanel.style.opacity = leftCount > 0 ? '1' : '0';
        rightPanel.style.opacity = rightCount > 0 ? '1' : '0';
        leftPanel.style.pointerEvents = leftCount > 0 ? 'auto' : 'none';
        rightPanel.style.pointerEvents = rightCount > 0 ? 'auto' : 'none';

        // Update sidebar button visibility
        this.updateSidebarButtons();
    }

    updateSidebarButtons() {
        const navButtons = document.querySelectorAll('.intro-nav-btn');
        if (!navButtons || !this.robot) return;

        CONFIG.sections.forEach((section, index) => {
            const dist = Math.abs(this.robot.position.z - section.z);
            const isReached = dist < 3;

            const button = navButtons[index];
            if (!button) return;

            if (isReached && !this.unlockedSections.has(section.name)) {
                // Newly reached section
                this.unlockedSections.add(section.name);
                button.classList.add('unlocked');
                this.showToast(`📍 ${section.name} unlocked!`);
            } else if (this.unlockedSections.has(section.name)) {
                // Already unlocked
                button.classList.add('unlocked');
            }
        });
    }

    showInteractButton(section) {
        const btn = document.getElementById('interact-btn');
        if (!btn) return;
        btn.style.opacity = 1;
        btn.innerHTML = `Explore <strong>${section.name}</strong> <span style="font-size:0.8em">[ENTER]</span>`;
        btn.onclick = () => this.enterSection(section);

        if (this.keys['Enter']) {
            this.enterSection(section);
            this.keys['Enter'] = false;
        }
    }

    enterSection(section) {
        // Hide intro sidebar
        const introSidebar = document.getElementById('intro-sidebar');
        if (introSidebar) {
            introSidebar.classList.add('hidden');
        }

        if (section.name === "Dashboard") {
            const app = document.querySelector('.app');
            if (app) {
                app.style.display = 'flex';
                // Force a resize event or Chart update if needed
                window.dispatchEvent(new Event('resize'));
            }

            const canvas = document.getElementById('canvas-container');
            if (canvas) canvas.style.opacity = '0.1';

            const ui = document.getElementById('ui-layer');
            if (ui) ui.style.display = 'none';
        } else {
            window.location.href = section.name.toLowerCase() + '.html';
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (this.robot) {
            if (this.keys.ArrowUp) this.velocity.z += CONFIG.robotSpeed * 0.1;
            if (this.keys.ArrowDown) this.velocity.z -= CONFIG.robotSpeed * 0.1;
            if (this.keys.ArrowLeft) this.velocity.x += CONFIG.robotSpeed * 0.1;
            if (this.keys.ArrowRight) this.velocity.x -= CONFIG.robotSpeed * 0.1;

            this.velocity.multiplyScalar(0.9);
            this.robot.position.add(this.velocity);

            const targetCamPos = this.robot.position.clone().add(new THREE.Vector3(0, 3, -8));
            this.camera.position.lerp(targetCamPos, 0.05);
            this.camera.lookAt(this.robot.position.clone().add(new THREE.Vector3(0, 1, 5)));
        }

        this.updateLabels();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showToast(msg) {
        const t = document.getElementById('toast');
        if (t) {
            t.innerText = msg;
            t.style.opacity = 1;
            setTimeout(() => t.style.opacity = 0, 4000);
        }
    }
}

// Ensure the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new IntroScene());
} else {
    new IntroScene();
}
