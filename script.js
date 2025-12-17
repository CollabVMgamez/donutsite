// Main Application

class SpinningShapeApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.controls = new Controls();
        this.currentShape = null;
        this.animationId = null;
        this.rotationSpeed = { x: 0.01, y: 0.02, z: 0.005 };
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.canvas = document.getElementById('shapeCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context');
            return;
        }
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create initial shape
        this.changeShape(this.controls.getValues().shape);
        
        // Start animation
        this.animate();
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    changeShape(shapeType) {
        this.currentShape = createShape(shapeType);
        this.applyControlValues();
    }
    
    applyControlValues() {
        const values = this.controls.getValues();
        this.currentShape.scale = values.size;
        this.currentShape.color = values.color;
        this.currentShape.resolution = values.resolution;
        this.rotationSpeed.x = values.speedX;
        this.rotationSpeed.y = values.speedY;
        this.rotationSpeed.z = values.speedZ;
    }
    
    updateRotationSpeed(axis, speed) {
        this.rotationSpeed[axis] = speed;
    }
    
    updateShapeProperty(property, value) {
        if (this.currentShape) {
            if (property === 'resolution') {
                // Regenerate points when resolution changes
                this.currentShape[property] = value;
                this.currentShape.points = [];
                this.currentShape.generatePoints();
            } else {
                this.currentShape[property] = value;
            }
        }
    }
    
    resetToDefaults(controlValues) {
        this.changeShape(controlValues.shape);
        this.rotationSpeed.x = controlValues.speedX;
        this.rotationSpeed.y = controlValues.speedY;
        this.rotationSpeed.z = controlValues.speedZ;
        this.applyControlValues();
    }
    
    animate() {
        if (this.currentShape) {
            // Update rotation
            this.currentShape.updateRotation(
                this.rotationSpeed.x,
                this.rotationSpeed.y,
                this.rotationSpeed.z
            );
            
            // Render shape
            this.currentShape.render(this.ctx, this.canvas);
        }
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Clean up resources
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpinningShapeApp();
});

// Handle page visibility changes to pause/resume animation
document.addEventListener('visibilitychange', () => {
    if (window.app) {
        if (document.hidden) {
            // Page is hidden, cancel animation
            if (window.app.animationId) {
                cancelAnimationFrame(window.app.animationId);
                window.app.animationId = null;
            }
        } else {
            // Page is visible, restart animation
            if (!window.app.animationId) {
                window.app.animate();
            }
        }
    }
});