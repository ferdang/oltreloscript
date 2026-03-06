let nodes = [];
let tesiData = [
    { title: "Skholé", text: "Riportare tra noi il senso di skholé, non inseguendo una fuga, ma restando a contatto con il problema." },
    { title: "Cyborg", text: "Un insieme di materia organica e tecnologica, passato e presente, vita e decomposizione." },
    { title: "Humus", text: "L'identità umana non più come isolata e superiore, ma come humus: groviglio di connessioni." },
    { title: "Hacker", text: "Smontare e ricomporre il tempo proprio come fa un hacker con un programma." },
    { title: "Matassa", text: "Nessun traguardo finale, solo fili che vengono passati da una mano all'altra, intrecciati con l'Altro." }
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Creiamo i nodi della matassa
    for (let i = 0; i < tesiData.length; i++) {
        nodes.push(new Node(random(width * 0.2, width * 0.8), random(height * 0.2, height * 0.8), tesiData[i]));
    }
}

function draw() {
    // Effetto di persistenza visiva (slow-time)
    background(10, 10, 10, 40); 
    
    drawConnections();

    nodes.forEach(n => {
        n.update();
        n.display();
    });
}

function drawConnections() {
    stroke(0, 255, 65, 30); // Verde trasparente per i fili
    strokeWeight(1);
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
    }
}

class Node {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.data = data;
        this.size = 12;
        this.isDragging = false;
        this.noiseOffset = random(1000); // Per un movimento organico non lineare
    }

    update() {
        if (this.isDragging) {
            this.x = mouseX;
            this.y = mouseY;
        } else {
            // Movimento fluttuante stile "humus" usando il Perlin Noise
            this.x += map(noise(this.noiseOffset), 0, 1, -0.5, 0.5);
            this.y += map(noise(this.noiseOffset + 100), 0, 1, -0.5, 0.5);
            this.noiseOffset += 0.005;
        }
    }

    display() {
        noStroke();
        fill(this.isDragging ? 255 : '#00ff41');
        ellipse(this.x, this.y, this.size);
        
        // Titolo accanto al nodo
        fill(150);
        textSize(10);
        text(this.data.title.toUpperCase(), this.x + 15, this.y + 4);
    }
}

// Gestione Interazione
function mousePressed() {
    nodes.forEach(n => {
        let d = dist(mouseX, mouseY, n.x, n.y);
        if (d < 20) {
            n.isDragging = true;
            displayInfo(n.data.text);
        }
    });
}

function mouseReleased() {
    nodes.forEach(n => n.isDragging = false);
}

function displayInfo(txt) {
    const box = document.getElementById('content-display');
    box.innerHTML = txt;
    box.style.display = 'block';
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}