// UI Controls Handler

class Controls {
    constructor() {
        this.shape = 'donut';
        this.size = 1.0;
        this.speedX = 0.01;
        this.speedY = 0.02;
        this.speedZ = 0.005;
        this.resolution = 30;
        this.color = '#ff6b6b';
        
        this.initControls();
    }
    
    initControls() {
        // Shape selector
        const shapeSelector = document.getElementById('shapeSelector');
        shapeSelector.addEventListener('change', (e) => {
            this.shape = e.target.value;
            if (window.app) {
                window.app.changeShape(this.shape);
            }
        });
        
        // Size control
        const sizeControl = document.getElementById('sizeControl');
        const sizeValue = document.getElementById('sizeValue');
        sizeControl.addEventListener('input', (e) => {
            this.size = parseFloat(e.target.value);
            sizeValue.textContent = this.size.toFixed(1);
            if (window.app) {
                window.app.updateShapeProperty('scale', this.size);
            }
        });
        
        // X rotation speed control
        const speedXControl = document.getElementById('speedXControl');
        const speedXValue = document.getElementById('speedXValue');
        speedXControl.addEventListener('input', (e) => {
            this.speedX = parseFloat(e.target.value);
            speedXValue.textContent = this.speedX.toFixed(3);
            if (window.app) {
                window.app.updateRotationSpeed('x', this.speedX);
            }
        });
        
        // Y rotation speed control
        const speedYControl = document.getElementById('speedYControl');
        const speedYValue = document.getElementById('speedYValue');
        speedYControl.addEventListener('input', (e) => {
            this.speedY = parseFloat(e.target.value);
            speedYValue.textContent = this.speedY.toFixed(3);
            if (window.app) {
                window.app.updateRotationSpeed('y', this.speedY);
            }
        });
        
        // Z rotation speed control
        const speedZControl = document.getElementById('speedZControl');
        const speedZValue = document.getElementById('speedZValue');
        speedZControl.addEventListener('input', (e) => {
            this.speedZ = parseFloat(e.target.value);
            speedZValue.textContent = this.speedZ.toFixed(3);
            if (window.app) {
                window.app.updateRotationSpeed('z', this.speedZ);
            }
        });
        
        // Resolution control
        const resolutionControl = document.getElementById('resolutionControl');
        const resolutionValue = document.getElementById('resolutionValue');
        resolutionControl.addEventListener('input', (e) => {
            this.resolution = parseInt(e.target.value);
            resolutionValue.textContent = this.resolution;
            if (window.app) {
                window.app.updateShapeProperty('resolution', this.resolution);
            }
        });
        
        // Color control
        const colorControl = document.getElementById('colorControl');
        colorControl.addEventListener('input', (e) => {
            this.color = e.target.value;
            if (window.app) {
                window.app.updateShapeProperty('color', this.color);
            }
        });
        
        // Reset button
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', () => {
            this.resetToDefaults();
        });
    }
    
    resetToDefaults() {
        // Use setTimeout to ensure DOM is updated before resetting
        setTimeout(() => {
            this.shape = 'donut';
            this.size = 1.0;
            this.speedX = 0.01;
            this.speedY = 0.02;
            this.speedZ = 0.005;
            this.resolution = 30;
            this.color = '#ff6b6b';
            
            // Update UI elements
            document.getElementById('shapeSelector').value = this.shape;
            document.getElementById('sizeControl').value = this.size;
            document.getElementById('sizeValue').textContent = this.size.toFixed(1);
            document.getElementById('speedXControl').value = this.speedX;
            document.getElementById('speedXValue').textContent = this.speedX.toFixed(3);
            document.getElementById('speedYControl').value = this.speedY;
            document.getElementById('speedYValue').textContent = this.speedY.toFixed(3);
            document.getElementById('speedZControl').value = this.speedZ;
            document.getElementById('speedZValue').textContent = this.speedZ.toFixed(3);
            document.getElementById('resolutionControl').value = this.resolution;
            document.getElementById('resolutionValue').textContent = this.resolution;
            document.getElementById('colorControl').value = this.color;
            
            // Update the application
            if (window.app) {
                window.app.resetToDefaults(this);
            }
        }, 0);
    }
    
    // Get current control values
    getValues() {
        return {
            shape: this.shape,
            size: this.size,
            speedX: this.speedX,
            speedY: this.speedY,
            speedZ: this.speedZ,
            resolution: this.resolution,
            color: this.color
        };
    }
}