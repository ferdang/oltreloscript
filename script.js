let x, y, px, py;
let angle = 0;
let speed = 2.5; 
let noiseOffset = 0;

let isLooping = false;
let loopFrames = 0;
let loopAngleDir = 0;

let nodes = [];
let segments = []; // Array che farà da "memoria" per tutti i pezzi di filo

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
    
    // Partenza da sinistra
    x = 0;
    y = height / 2;
    px = x;
    py = y;
    angle = 0; 
}

function draw() {
    stroke(204, 0, 0, 180); 
    strokeWeight(1.5);
    
    // 1. GESTIONE RICCIOLI E MOVIMENTO
    if (isLooping) {
        angle += loopAngleDir;
        loopFrames--;
        if (loopFrames <= 0) {
            isLooping = false; 
            // Non creiamo più il nodo qui! Ora se ne occupa il rilevatore di incroci globale
        }
    } else {
        angle += map(noise(noiseOffset), 0, 1, -0.08, 0.08);
        noiseOffset += 0.02;
        
        let margin = min(width, height) * 0.15; 
        if (x < margin || x > width - margin || y < margin || y > height - margin) {
            let targetAngle = atan2(height / 2 - y, width / 2 - x);
            let diff = targetAngle - angle;
            while (diff < -PI) diff += TWO_PI;
            while (diff > PI) diff -= TWO_PI;
            angle += diff * 0.04; 
        }

        if (random(1) < 0.005 && x > 200) {
            isLooping = true;
            loopFrames = floor(random(40, 70)); 
            loopAngleDir = random([-0.12, 0.12]); 
        }
    }

    // Calcolo nuova posizione
    x += cos(angle) * speed;
    y += sin(angle) * speed;

    // Disegno linea
    line(px, py, x, y);

    // 2. RILEVATORE DI INCROCI
    // Creiamo il nuovo "pezzettino" (segmento) appena disegnato
    let newSegment = {x1: px, y1: py, x2: x, y2: y};
    
    // Lo confrontiamo con la nostra memoria dei segmenti vecchi.
    // Evitiamo gli ultimissimi (es. length - 20) per evitare che la curva stretta venga vista come un falso incrocio.
    for (let i = 0; i < segments.length - 20; i++) {
        let oldSegment = segments[i];
        
        // Calcolo matematico dell'intersezione
        let intersect = getIntersection(newSegment.x1, newSegment.y1, newSegment.x2, newSegment.y2, oldSegment.x1, oldSegment.y1, oldSegment.x2, oldSegment.y2);
        
        if (intersect) {
            // Trovato un incrocio! Controlliamo se c'è già un nodo vicinissimo per non sovrapporli
            let tooClose = false;
            for (let n of nodes) {
                if (dist(intersect.x, intersect.y, n.x, n.y) < 30) {
                    tooClose = true;
                    break;
                }
            }
            
            // Se lo spazio è libero, crea il nodo
            if (!tooClose) {
                // IL TRUCCO PER IL LOOP INFINITO: usiamo il modulo %
                let dataIndex = nodes.length % tesiData.length;
                nodes.push({ x: intersect.x, y: intersect.y, data: tesiData[dataIndex] });
            }
        }
    }

    // Salviamo in memoria il pezzettino appena disegnato
    segments.push(newSegment);
    
    // Ottimizzazione: per evitare che il cellulare esploda se lasciano la pagina aperta per 3 ore,
    // facciamo dimenticare i segmenti più vecchi di 3000 passi.
    if (segments.length > 3000) {
        segments.shift(); 
    }

    // Aggiornamento per il frame successivo
    px = x;
    py = y;

    drawNodes();
}

// Funzione di servizio: calcola il punto esatto in cui due linee si tagliano
function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) return null; // Le linee sono parallele

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    // Se t e u sono compresi tra 0 e 1, le linee si incrociano fisicamente in quel punto
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
        ellipse(n.x, n.y, 35, 35); // Alone più grande per facilitare il tap da mobile
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
    segments = []; // Azzeriamo anche la memoria al ridimensionamento
}