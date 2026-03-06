let x, y, px, py;
let angle = 0;
let speed = 3; 
let noiseOffset = 0;

let nodes = [];
let segments = []; // La "memoria" del tracciato

let tesiData = [
    { title: "Tempo Astratto", text: "In quest’epoca rincorriamo la tecnologia. Il tempo è diventato un concetto astratto e non è più umano." },
    { title: "Hackerare il Tempo", text: "Una dichiarazione d’intenti: smontare e ricomporre la nostra condizione come un hacker con un programma." },
    { title: "Donna Haraway", text: "Ci guida verso un cambio di rotta: riconoscerci come cyborg, ma soprattutto come nodi di una fitta rete: come humus." },
    { title: "La Matassa", text: "Nelle nostre azioni non deve esserci un traguardo finale, solo fili che vengono passati da una mano all’altra, intrecciati con quello della macchina." },
    { title: "Diventare Umani", text: "Riacquisire la consapevolezza che siamo corpi, menti, anime, e che possiamo restare a contatto con il problema." }
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(17);
    
    // Partenza da sinistra, al centro
    x = 0;
    y = height / 2;
    px = x;
    py = y;
    angle = 0; 
}

function draw() {
    stroke(204, 0, 0, 180); 
    strokeWeight(1.5);
    
    // 1. MOVIMENTO PURAMENTE ORGANICO E CASUALE (Perlin Noise)
    // Ho aumentato leggermente il range (-0.1, 0.1) per renderlo più "serpeggiante"
    angle += map(noise(noiseOffset), 0, 1, -0.1, 0.1);
    noiseOffset += 0.02;
    
    // Sterzata morbida prima di sbattere sui bordi
    let margin = min(width, height) * 0.15; 
    if (x < margin || x > width - margin || y < margin || y > height - margin) {
        let targetAngle = atan2(height / 2 - y, width / 2 - x);
        let diff = targetAngle - angle;
        while (diff < -PI) diff += TWO_PI;
        while (diff > PI) diff -= TWO_PI;
        angle += diff * 0.04; 
    }

    // Calcolo nuova posizione
    x += cos(angle) * speed;
    y += sin(angle) * speed;

    // Disegno la linea
    line(px, py, x, y);

    // 2. RILEVATORE DI INCROCI NATURALI
    let newSegment = {x1: px, y1: py, x2: x, y2: y};
    
    for (let i = 0; i < segments.length - 20; i++) {
        let oldSegment = segments[i];
        let intersect = getIntersection(newSegment.x1, newSegment.y1, newSegment.x2, newSegment.y2, oldSegment.x1, oldSegment.y1, oldSegment.x2, oldSegment.y2);
        
        if (intersect) {
            let tooClose = false;
            for (let n of nodes) {
                // Se c'è già un nodo a meno di 40 pixel di distanza, ignora (evita ammassamenti)
                if (dist(intersect.x, intersect.y, n.x, n.y) < 40) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                let dataIndex = nodes.length % tesiData.length;
                nodes.push({ x: intersect.x, y: intersect.y, data: tesiData[dataIndex] });
            }
        }
    }

    segments.push(newSegment);
    
    // Limite memoria tracciato per non sovraccaricare il cellulare
    if (segments.length > 3000) {
        segments.shift(); 
    }

    px = x;
    py = y;

    drawNodes();
}

// Calcola il punto esatto in cui due linee si tagliano
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) return null; 

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    if (t > 0 && t < 1 && u > 0 && u < 1) {
        return {
            x: x1 + t * (x2 - x1),
            y: y1 + t * (y2 - y1)
        };
    }
    return null;
}

function drawNodes() {
    nodes.forEach(n => {
        fill(204, 0, 0);
        noStroke();
        ellipse(n.x, n.y, 8, 8);
        
        fill(204, 0, 0, 30 + sin(frameCount * 0.05) * 20);
        ellipse(n.x, n.y, 35, 35); 
    });
}

function mousePressed() {
    nodes.forEach(n => {
        let d = dist(mouseX, mouseY, n.x, n.y);
        if (d < 35) {
            showConcept(n.data);
        }
    });
}

function showConcept(data) {
    document.getElementById('concept-title').innerText = data.title;
    document.getElementById('concept-text').innerText = data.text;
    document.getElementById('content-display').style.display = 'block';
    noLoop(); 
}

function closeBox() {
    document.getElementById('content-display').style.display = 'none';
    loop(); 
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(17);
    x = 0; y = height / 2; px = x; py = y; angle = 0;
    nodes = []; 
    segments = [];
}