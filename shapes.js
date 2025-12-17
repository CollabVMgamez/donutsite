// Shape generation algorithms

class Shape3D {
    constructor() {
        this.points = [];
        this.pointsGenerated = false;
        this.rotation = { x: 0, y: 0, z: 0 };
        this.scale = 1;
        this.color = '#ff6b6b';
        this.resolution = 30;
    }
    
    // Rotate point around X axis
    rotateX(point, angle) {
        const y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
        const z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
        return { x: point.x, y: y, z: z };
    }
    
    // Rotate point around Y axis
    rotateY(point, angle) {
        const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
        const z = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
        return { x: x, y: point.y, z: z };
    }
    
    // Rotate point around Z axis
    rotateZ(point, angle) {
        const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
        const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
        return { x: x, y: y, z: point.z };
    }
    
    // Project 3D point to 2D canvas
    project(point, canvas) {
        // Simple perspective projection
        const factor = 400 / (400 + point.z);
        const x = point.x * factor + canvas.width / 2;
        const y = point.y * factor + canvas.height / 2;
        return { x: x, y: y, z: point.z };
    }
    
    // Generate shape points (to be overridden by subclasses)
    generatePoints() {
        // This method should be implemented by specific shape classes
    }
    
    // Update rotation
    updateRotation(speedX, speedY, speedZ) {
        this.rotation.x += speedX;
        this.rotation.y += speedY;
        this.rotation.z += speedZ;
    }
    
    // Render the shape
    render(ctx, canvas) {
        // Generate points if not already done or if canvas size changed
        if (this.points.length === 0 || !this.pointsGenerated) {
            this.generatePoints();
            this.pointsGenerated = true;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Transform and render points
        const transformedPoints = this.points.map(point => {
            // Apply scaling
            let scaledPoint = {
                x: point.x * this.scale,
                y: point.y * this.scale,
                z: point.z * this.scale
            };
            
            // Apply rotations
            let rotatedPoint = this.rotateX(scaledPoint, this.rotation.x);
            rotatedPoint = this.rotateY(rotatedPoint, this.rotation.y);
            rotatedPoint = this.rotateZ(rotatedPoint, this.rotation.z);
            
            // Project to 2D
            return this.project(rotatedPoint, canvas);
        });
        
        // Draw points
        ctx.fillStyle = this.color;
        transformedPoints.forEach(point => {
            // Only draw points that are in front of the camera
            if (point.z > -400) {
                const size = Math.max(1, 3 * (1 - point.z / 1000));
                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}

// Donut (Torus) shape
class Donut extends Shape3D {
    generatePoints() {
        this.points = [];
        const R = 100; // Major radius
        const r = 40;  // Minor radius
        
        for (let i = 0; i < this.resolution; i++) {
            const theta = (i / this.resolution) * Math.PI * 2;
            for (let j = 0; j < this.resolution; j++) {
                const phi = (j / this.resolution) * Math.PI * 2;
                
                const x = (R + r * Math.cos(phi)) * Math.cos(theta);
                const y = r * Math.sin(phi);
                const z = (R + r * Math.cos(phi)) * Math.sin(theta);
                
                this.points.push({ x: x, y: y, z: z });
            }
        }
    }
}

// Sphere shape
class Sphere extends Shape3D {
    generatePoints() {
        this.points = [];
        const radius = 80;
        
        for (let i = 0; i < this.resolution; i++) {
            const theta = (i / this.resolution) * Math.PI;
            for (let j = 0; j < this.resolution; j++) {
                const phi = (j / this.resolution) * Math.PI * 2;
                
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(theta);
                
                this.points.push({ x: x, y: y, z: z });
            }
        }
    }
}

// Cube shape
class Cube extends Shape3D {
    generatePoints() {
        this.points = [];
        const size = 70;
        const step = Math.max(1, Math.floor(this.resolution / 5));
        
        // Generate points for each face of the cube
        for (let x = -size; x <= size; x += step) {
            for (let y = -size; y <= size; y += step) {
                // Front face (z = size)
                this.points.push({ x: x, y: y, z: size });
                // Back face (z = -size)
                this.points.push({ x: x, y: y, z: -size });
            }
        }
        
        for (let x = -size; x <= size; x += step) {
            for (let z = -size; z <= size; z += step) {
                // Top face (y = size)
                this.points.push({ x: x, y: size, z: z });
                // Bottom face (y = -size)
                this.points.push({ x: x, y: -size, z: z });
            }
        }
        
        for (let y = -size; y <= size; y += step) {
            for (let z = -size; z <= size; z += step) {
                // Left face (x = -size)
                this.points.push({ x: -size, y: y, z: z });
                // Right face (x = size)
                this.points.push({ x: size, y: y, z: z });
            }
        }
    }
}

// Pyramid shape
class Pyramid extends Shape3D {
    generatePoints() {
        this.points = [];
        const baseSize = 80;
        const height = 100;
        const step = Math.max(1, Math.floor(this.resolution / 5));
        
        // Base points
        for (let x = -baseSize; x <= baseSize; x += step) {
            for (let z = -baseSize; z <= baseSize; z += step) {
                this.points.push({ x: x, y: -height/2, z: z });
            }
        }
        
        // Sides - connect base points to apex
        const apex = { x: 0, y: height/2, z: 0 };
        for (let i = 0; i < this.resolution * 2; i++) {
            const angle = (i / this.resolution) * Math.PI * 2;
            const x = baseSize * Math.cos(angle);
            const z = baseSize * Math.sin(angle);
            
            // Add points along the edges from base to apex
            for (let j = 0; j < 5; j++) {
                const t = j / 4;
                this.points.push({
                    x: x * (1 - t),
                    y: -height/2 * (1 - t) + height/2 * t,
                    z: z * (1 - t)
                });
            }
        }
    }
}

// Factory function to create shapes
function createShape(type) {
    switch(type) {
        case 'donut':
            return new Donut();
        case 'sphere':
            return new Sphere();
        case 'cube':
            return new Cube();
        case 'pyramid':
            return new Pyramid();
        default:
            return new Donut();
    }
}