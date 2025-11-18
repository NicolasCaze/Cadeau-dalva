// a Configuration du QCM - Tu pourras modifier ces questions
const quizData = [
    {
        question: "On s'est mis en couple le ?",
        answers: ["14 juillet", "15 juillet", "on est pas en couple", "aucune idée"],
        correct: 0
    },
    {
        question: "Quelle est le nom du bar à notre premier date ?",
        answers: ["Le Michel's", "Café Utopia", "Les cafes de tonton", "Peaky Pub"],
        correct: 1
    },
    {
        question: "Tu es en couple avec moi pour quelle raison ?",
        answers: ["Ma puff", "Mon appart", "Pour moi", "Tu sais pas"],
        correct: 2
    },
    {
        question: "Qu'est ce que j'aime le plus chez toi ?",
        answers: ["Tes périodes de règle", "ton caractère", "Ton don pour la cuisine ", "Tout ça à la fois"],
        correct: 3
    },
    {
        question: "Tu m'aimerais quand même si j'étais un homme tronc ?",
        answers: ["Oui", "Non", "Normal tu es tout pour moi"],
        correct: 1
    },
];

// Données pour la page interactive
const interactiveItems = {
    card: {
        title: "Ma lettre d'amour ❤️",
        content: `
            <p>Ma chérie,</p>
            <p>Aujourd'hui c'est ton anniversaire et je voulais te dire à quel point tu comptes pour moi...</p>
            <p><em>Tu pourras personnaliser ce message plus tard</em></p>
            <p>Je t'aime ❤️</p>
        `
    },
    photos: {
        title: "Nos plus beaux souvenirs 📸",
        content: `
            <div class="photo-gallery">
                <div class="photo-item">
                    <img src="https://via.placeholder.com/300x200/960018/white?text=Photo+1" alt="Notre photo 1">
                </div>
                <div class="photo-item">
                    <img src="https://via.placeholder.com/300x200/960018/white?text=Photo+2" alt="Notre photo 2">
                </div>
                <div class="photo-item">
                    <img src="https://via.placeholder.com/300x200/960018/white?text=Photo+3" alt="Notre photo 3">
                </div>
            </div>
            <p><em>Tu pourras remplacer ces images par vos vraies photos</em></p>
        `
    }
};

// Variables globales
let currentQuestionIndex = 0;
let score = 0;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Navigation entre les pages
    document.getElementById('discover-btn').addEventListener('click', () => {
        // Aller directement à la page cadeau (skip QCM pour les tests)
        showPage('gift-page');
        setTimeout(initBabylonScene, 500);
    });

    // QCM commenté pour les tests
    
    document.getElementById('start-quiz-btn').addEventListener('click', () => {
        startQuiz();
    });

    document.getElementById('next-question-btn').addEventListener('click', () => {
        nextQuestion();
    });

    document.getElementById('final-gift-btn').addEventListener('click', () => {
        showPage('timeline-page');
        setTimeout(init3DScene, 500);
    });
    

    // Interface 3D
    document.getElementById('close-item').addEventListener('click', () => {
        closeItemView();
    });
}

function showPage(pageId) {
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Afficher la page demandée
    document.getElementById(pageId).classList.add('active');
}

// === LOGIQUE DU QCM ===
function startQuiz() {
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-content').classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const question = quizData[currentQuestionIndex];
    
    // Mettre à jour le compteur
    document.getElementById('question-counter').textContent = 
        `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    
    // Afficher la question
    document.getElementById('question-text').textContent = question.question;
    
    // Créer les réponses
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = answer;
        answerDiv.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerDiv);
    });
    
    // Masquer le bouton suivant
    document.getElementById('next-question-btn').classList.add('hidden');
}

function selectAnswer(selectedIndex) {
    const question = quizData[currentQuestionIndex];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Désactiver tous les clics
    answerOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Marquer la réponse sélectionnée
    answerOptions[selectedIndex].classList.add('selected');
    
    // Vérifier si c'est correct
    if (selectedIndex === question.correct) {
        score++;
        answerOptions[selectedIndex].classList.add('correct');
    } else {
        answerOptions[selectedIndex].classList.add('incorrect');
        answerOptions[question.correct].classList.add('correct');
    }
    
    // Afficher le bouton suivant après un délai
    setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
            document.getElementById('next-question-btn').classList.remove('hidden');
        } else {
            showResults();
        }
    }, 1500);
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function showResults() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');
    document.getElementById('final-score').textContent = `${score}/${quizData.length}`;
}

// === SCÈNE BABYLON.JS SIMPLIFIÉE ===
let engine, scene, camera;

function initBabylonScene() {
    const loadingScreen = document.getElementById('loading-3d');
    const canvas = document.getElementById('babylon-canvas');
    
    // Attendre que Babylon.js soit complètement chargé
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInitBabylon() {
        attempts++;
        
        if (typeof BABYLON === 'undefined') {
            if (attempts < maxAttempts) {
                loadingScreen.innerHTML = `<p>Chargement Babylon.js... (${attempts}/${maxAttempts})</p>`;
                setTimeout(tryInitBabylon, 500);
                return;
            } else {
                loadingScreen.innerHTML = `<p>Problème version Babylon.js - Passage en CSS 3D</p>`;
                setTimeout(initCSS3DFallback, 1000);
                return;
            }
        }
        
        // Test minimal Babylon.js
        try {
            loadingScreen.innerHTML = `<p>Test minimal Babylon.js... 🔧</p>`;
            
            // Test 1: Moteur
            loadingScreen.innerHTML = `<p>Test 1: Création moteur...</p>`;
            engine = new BABYLON.Engine(canvas, true);
            
            // Test 2: Scène nocturne ultra-réaliste
            loadingScreen.innerHTML = `<p>Création environnement nocturne...</p>`;
            scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(0.02, 0.02, 0.05); // Presque noir
            
            // Skybox nuit profonde
            const skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", {diameter:100}, scene);
            const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.emissiveColor = new BABYLON.Color3(0.01, 0.01, 0.03); // Très sombre
            
            skybox.material = skyboxMaterial;
            skybox.infiniteDistance = true;
            
            // ÉTOILES BRILLANTES dans le ciel
            for (let i = 0; i < 80; i++) {
                const star = BABYLON.MeshBuilder.CreateSphere("star" + i, {diameter: 0.05 + Math.random() * 0.03}, scene);
                
                // Position aléatoire sur la sphère, seulement dans la partie haute
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI * 0.7; // Seulement partie haute du ciel
                const radius = 40;
                
                star.position.x = radius * Math.sin(theta) * Math.cos(phi);
                star.position.y = Math.abs(radius * Math.cos(theta)) + 5; // Toujours au-dessus
                star.position.z = radius * Math.sin(theta) * Math.sin(phi);
                
                const starMaterial = new BABYLON.StandardMaterial("starMat" + i, scene);
                // Étoiles de différentes couleurs
                const starIntensity = 0.8 + Math.random() * 0.4;
                if (Math.random() > 0.8) {
                    starMaterial.emissiveColor = new BABYLON.Color3(1.0 * starIntensity, 0.8 * starIntensity, 0.6 * starIntensity); // Étoiles chaudes
                } else {
                    starMaterial.emissiveColor = new BABYLON.Color3(0.8 * starIntensity, 0.9 * starIntensity, 1.0 * starIntensity); // Étoiles froides
                }
                starMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                starMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                star.material = starMaterial;
                
                // Animation de scintillement pour certaines étoiles
                if (Math.random() > 0.7) {
                    BABYLON.Animation.CreateAndStartAnimation(
                        "starTwinkle" + i,
                        starMaterial,
                        "emissiveColor",
                        30,
                        60 + Math.random() * 60,
                        starMaterial.emissiveColor,
                        starMaterial.emissiveColor.scale(0.3),
                        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
                    );
                }
            }
            
            // LUNE BRILLANTE qui éclaire la mer
            const moon = BABYLON.MeshBuilder.CreateSphere("moon", {diameter: 4}, scene);
            moon.position.set(-20, 20, 45); // Position au-dessus de la mer
            
            const moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
            moonMaterial.emissiveColor = new BABYLON.Color3(1.2, 1.2, 1.4); // Très brillante
            moonMaterial.diffuseColor = new BABYLON.Color3(0.95, 0.95, 1.0);
            moonMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            moon.material = moonMaterial;
            
            // Lumière de lune qui éclaire la mer
            const moonLightForSea = new BABYLON.PointLight("moonLightSea", moon.position, scene);
            moonLightForSea.diffuse = new BABYLON.Color3(0.6, 0.6, 0.8); // Bleu lunaire
            moonLightForSea.specular = new BABYLON.Color3(0.8, 0.8, 1.0);
            moonLightForSea.intensity = 2.0;
            moonLightForSea.range = 100; // Porte loin pour éclairer la mer
            
            // Test 3: Caméra
            loadingScreen.innerHTML = `<p>Test 3: Création caméra...</p>`;
            camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -5), scene);
            
            // Test 4: ÉCLAIRAGE CHALEUREUX ET BEAU
            loadingScreen.innerHTML = `<p>Création éclairage chaleureux...</p>`;
            
            // Lumière ambiante CHALEUREUSE
            const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
            ambientLight.diffuse = new BABYLON.Color3(0.4, 0.3, 0.2); // Couleur chaude dorée
            ambientLight.groundColor = new BABYLON.Color3(0.2, 0.15, 0.1); // Sol chaleureux
            ambientLight.intensity = 0.8; // Bien visible
            
            // Lumière directionnelle douce de lune
            const moonLight = new BABYLON.DirectionalLight("moonLight", new BABYLON.Vector3(-0.3, -1, -0.2), scene);
            moonLight.diffuse = new BABYLON.Color3(0.6, 0.6, 0.8); // Bleu doux
            moonLight.specular = new BABYLON.Color3(0.4, 0.4, 0.6);
            moonLight.intensity = 0.6; // Plus visible
            
            // Bougie CHALEUREUSE sur la table
            const candleLight = new BABYLON.PointLight("candleLight", new BABYLON.Vector3(0.8, 1.1, 0.3), scene);
            candleLight.diffuse = new BABYLON.Color3(1.0, 0.7, 0.3); // Orange chaleureux
            candleLight.specular = new BABYLON.Color3(1.0, 0.8, 0.5); // Reflets dorés
            candleLight.intensity = 15.0; // Puissant et chaleureux
            candleLight.range = 6.0; // Large portée
            
            // Lumière d'ambiance générale CHAUDE
            const warmLight = new BABYLON.PointLight("warmLight", new BABYLON.Vector3(0, 2.0, 0), scene);
            warmLight.diffuse = new BABYLON.Color3(0.8, 0.6, 0.4); // Couleur très chaude
            warmLight.specular = new BABYLON.Color3(0.6, 0.5, 0.3); // Reflets chauds
            warmLight.intensity = 8.0; // Éclairage général chaleureux
            warmLight.range = 8.0; // Couvre toute la scène
            
            // PAS D'OMBRES pour un rendu chaleureux
            // const shadowGenerator = new BABYLON.ShadowGenerator(2048, candleLight);
            // shadowGenerator.darkness = 0.0;
            // scene.shadowGenerator = shadowGenerator;
            
            // Test 5: SABLE DE PLAGE ULTRA-RÉALISTE
            loadingScreen.innerHTML = `<p>Création du sable de plage...</p>`;
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20, subdivisions: 128}, scene);
            const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
            
            // Couleur sable de plage nocturne authentique
            groundMaterial.diffuseColor = new BABYLON.Color3(0.85, 0.75, 0.60); // Beige sable
            groundMaterial.specularColor = new BABYLON.Color3(0.15, 0.12, 0.08); // Reflets subtils
            groundMaterial.roughness = 0.9; // Très rugueux
            groundMaterial.specularPower = 16; // Reflets diffus mais visibles
            
            // Effet de granularité et humidité du sable
            groundMaterial.emissiveColor = new BABYLON.Color3(0.01, 0.008, 0.005); // Très subtil
            
            ground.material = groundMaterial;
            ground.receiveShadows = true;
            
            // Sol simple sans déformation pour éviter les erreurs
            
            // Ajout de petits monticules de sable pour le relief
            for (let i = 0; i < 12; i++) {
                const sandMound = BABYLON.MeshBuilder.CreateSphere("sandMound" + i, {
                    diameter: Math.random() * 0.4 + 0.1,
                    segments: 8
                }, scene);
                
                sandMound.position.x = (Math.random() - 0.5) * 12;
                sandMound.position.z = (Math.random() - 0.5) * 12;
                sandMound.position.y = -0.03;
                sandMound.scaling.y = 0.2; // Très aplati pour effet naturel
                
                sandMound.material = groundMaterial;
                sandMound.receiveShadows = true;
                shadowGenerator.addShadowCaster(sandMound);
            }
            
            // MER VISIBLE À L'HORIZON - Plus contrastée
            loadingScreen.innerHTML = `<p>Création de la mer...</p>`;
            const sea = BABYLON.MeshBuilder.CreateGround("sea", {width: 300, height: 150, subdivisions: 32}, scene);
            sea.position.y = -0.1; // Niveau de la mer
            sea.position.z = 40; // Plus proche pour être visible
            
            const seaMaterial = new BABYLON.StandardMaterial("seaMaterial", scene);
            seaMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.1, 0.25); // Bleu très sombre mais visible
            seaMaterial.specularColor = new BABYLON.Color3(0.4, 0.5, 0.8); // Reflets bleus prononcés
            seaMaterial.specularPower = 128; // Reflets très nets
            seaMaterial.roughness = 0.05; // Très lisse comme l'eau
            
            // Reflets de lune sur l'eau
            seaMaterial.emissiveColor = new BABYLON.Color3(0.08, 0.08, 0.15); // Plus visible
            
            sea.material = seaMaterial;
            sea.receiveShadows = true;
            
            // Ligne d'horizon bien visible
            const horizon = BABYLON.MeshBuilder.CreateBox("horizon", {width: 400, height: 0.5, depth: 1}, scene);
            horizon.position.y = 1.0;
            horizon.position.z = 60;
            
            const horizonMaterial = new BABYLON.StandardMaterial("horizonMaterial", scene);
            horizonMaterial.emissiveColor = new BABYLON.Color3(0.15, 0.15, 0.25); // Lueur plus visible
            horizonMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            horizon.material = horizonMaterial;
            
            // Test 6: Table ronde plus petite
            loadingScreen.innerHTML = `<p>Création de la table...</p>`;
            const table = BABYLON.MeshBuilder.CreateCylinder("table", {
                height: 0.08,
                diameter: 2.5,
                tessellation: 32
            }, scene);
            table.position.y = 0.75;
            
            // Matériau bois réaliste avec grain
            const tableMaterial = new BABYLON.StandardMaterial("tableMat", scene);
            tableMaterial.diffuseColor = new BABYLON.Color3(0.45, 0.25, 0.12);
            tableMaterial.specularColor = new BABYLON.Color3(0.2, 0.15, 0.08);
            tableMaterial.roughness = 0.7;
            
            // Couleur bois sans texture procédurale
            
            table.material = tableMaterial;
            table.receiveShadows = true;
            shadowGenerator.addShadowCaster(table);
            
            // Pieds de table SOUS la table
            for (let i = 0; i < 4; i++) {
                const leg = BABYLON.MeshBuilder.CreateCylinder("tableLeg" + i, {
                    height: 0.75, // Hauteur jusqu'au dessous de la table
                    diameter: 0.06,
                    tessellation: 16
                }, scene);
                
                const angle = (i / 4) * Math.PI * 2;
                leg.position.x = Math.cos(angle) * 1.0; // Plus près du centre (rayon table = 1.25)
                leg.position.z = Math.sin(angle) * 1.0;
                leg.position.y = 0.375; // Milieu de la hauteur (0.75/2)
                
                leg.material = tableMaterial;
                leg.receiveShadows = true;
                shadowGenerator.addShadowCaster(leg);
            }
            
            // Test 7: Assiette sur la table
            loadingScreen.innerHTML = `<p>Création de l'assiette...</p>`;
            const plate = BABYLON.MeshBuilder.CreateCylinder("plate", {
                height: 0.02,
                diameter: 0.8,
                tessellation: 32
            }, scene);
            plate.position.y = 0.79; // Sur la table (0.75 + 0.04 hauteur table + 0.01 épaisseur assiette)
            
            // Matériau porcelaine simple
            const plateMaterial = new BABYLON.StandardMaterial("plateMat", scene);
            plateMaterial.diffuseColor = new BABYLON.Color3(0.98, 0.98, 0.98);
            plateMaterial.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
            plateMaterial.backFaceCulling = false;
            
            plate.material = plateMaterial;
            // Plus d'ombres pour un rendu chaleureux
            
            // Bordure dorée brillante
            const rim = BABYLON.MeshBuilder.CreateTorus("plateRim", {
                diameter: 0.8,
                thickness: 0.015,
                tessellation: 32
            }, scene);
            rim.position.y = 0.80;
            
            const rimMaterial = new BABYLON.StandardMaterial("rimMat", scene);
            rimMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.8, 0.0);
            rimMaterial.specularColor = new BABYLON.Color3(1.0, 1.0, 0.5);
            rimMaterial.specularPower = 256;
            rimMaterial.roughness = 0.1;
            
            rim.material = rimMaterial;
            // Plus d'ombres pour un rendu chaleureux
            
            // Test 8: Fraises
            loadingScreen.innerHTML = `<p>Ajout des fraises...</p>`;
            for (let i = 0; i < 5; i++) {
                const strawberry = BABYLON.MeshBuilder.CreateSphere("strawberry" + i, {
                    diameter: 0.12,
                    segments: 12
                }, scene);
                
                const angle = (i / 5) * Math.PI * 2;
                strawberry.position.x = Math.cos(angle) * 0.25;
                strawberry.position.z = Math.sin(angle) * 0.25;
                strawberry.position.y = 0.85; // Sur l'assiette (0.79 + 0.01 épaisseur + 0.05 rayon fraise)
                
                // Matériau fraise simple
                const strawberryMat = new BABYLON.StandardMaterial("strawberryMat" + i, scene);
                strawberryMat.diffuseColor = new BABYLON.Color3(0.9, 0.2, 0.2);
                strawberryMat.specularColor = new BABYLON.Color3(0.3, 0.1, 0.1);
                strawberryMat.backFaceCulling = false;
                
                // Matériau fraise sans texture procédurale
                
                strawberry.material = strawberryMat;
                // Plus d'ombres pour un rendu chaleureux
                
                // Petites feuilles vertes sur la fraise
                const leaves = BABYLON.MeshBuilder.CreateCylinder("leaves" + i, {
                    height: 0.02,
                    diameterTop: 0.06,
                    diameterBottom: 0.04,
                    tessellation: 6
                }, scene);
                leaves.position.x = strawberry.position.x;
                leaves.position.z = strawberry.position.z;
                leaves.position.y = strawberry.position.y + 0.06;
                
                const leavesMat = new BABYLON.StandardMaterial("leavesMat" + i, scene);
                leavesMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
                leaves.material = leavesMat;
            }
            
            // Test 9: Pot de moutarde
            loadingScreen.innerHTML = `<p>Ajout du pot de moutarde...</p>`;
            const mustardJar = BABYLON.MeshBuilder.CreateCylinder("mustard", {
                height: 0.25,
                diameterTop: 0.15,
                diameterBottom: 0.18,
                tessellation: 16
            }, scene);
            mustardJar.position.set(0.6, 0.915, -0.2); // Sur la table (0.75 + 0.04 + 0.125 hauteur pot)
            
            // Matériau moutarde brillant - SANS FACES NOIRES
            const mustardMat = new BABYLON.StandardMaterial("mustardMat", scene);
            mustardMat.diffuseColor = new BABYLON.Color3(1.0, 0.85, 0.1);
            mustardMat.specularColor = new BABYLON.Color3(0.8, 0.7, 0.2);
            mustardMat.specularPower = 64;
            mustardMat.roughness = 0.3;
            mustardMat.backFaceCulling = false; // Éclaire les deux faces
            mustardMat.twoSidedLighting = true; // Lumière des deux côtés
            
            mustardJar.material = mustardMat;
            mustardJar.receiveShadows = true;
            shadowGenerator.addShadowCaster(mustardJar);
            
            // Étiquette sur le pot
            const label = BABYLON.MeshBuilder.CreatePlane("label", {size: 0.12}, scene);
            label.position.set(0.4, 1.0, -0.22);
            label.rotation.y = Math.PI;
            
            const labelMat = new BABYLON.StandardMaterial("labelMat", scene);
            labelMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
            labelMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            label.material = labelMat;
            
            // Test 10: Carte SUR la table
            loadingScreen.innerHTML = `<p>Ajout de la carte...</p>`;
            const card = BABYLON.MeshBuilder.CreateBox("card", {
                width: 0.25,
                height: 0.35,
                depth: 0.015
            }, scene);
            card.position.set(-0.6, 0.8, 0.2); // SUR la table (y = 0.79 + épaisseur)
            card.rotation.y = Math.PI / 8; // Légèrement inclinée
            
            const cardMat = new BABYLON.StandardMaterial("cardMat", scene);
            cardMat.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.95);
            cardMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
            cardMat.backFaceCulling = false;
            card.material = cardMat;
            
            // Test 11: Photos SUR la table
            loadingScreen.innerHTML = `<p>Ajout des photos...</p>`;
            for (let i = 0; i < 3; i++) {
                const photo = BABYLON.MeshBuilder.CreateBox("photo" + i, {
                    width: 0.15,
                    height: 0.2,
                    depth: 0.01
                }, scene);
                
                photo.position.x = 0.3 + i * 0.25; // SUR la table, côte à côte
                photo.position.y = 0.8; // SUR la table
                photo.position.z = -0.4;
                photo.rotation.y = -Math.PI / 12 + (i - 1) * 0.05; // Légèrement étalées
                
                const photoMat = new BABYLON.StandardMaterial("photoMat" + i, scene);
                photoMat.diffuseColor = new BABYLON.Color3(1.0, 0.98, 0.95); // Blanc chaud
                photoMat.specularColor = new BABYLON.Color3(0.7, 0.6, 0.4); // Reflets dorés
                photoMat.specularPower = 24;
                photoMat.backFaceCulling = false;
                photoMat.twoSidedLighting = true;
                photoMat.emissiveColor = new BABYLON.Color3(0.04, 0.04, 0.03); // Auto-illumination chaude
                photo.material = photoMat;
            }
            
            // Test 12: Interactions
            loadingScreen.innerHTML = `<p>Configuration des interactions...</p>`;
            scene.onPointerObservable.add((pointerInfo) => {
                if (pointerInfo.pickInfo && pointerInfo.pickInfo.hit) {
                    const mesh = pointerInfo.pickInfo.pickedMesh;
                    if (mesh && mesh.name === "card") {
                        showItemContent(interactiveItems.card);
                    } else if (mesh && mesh.name.startsWith("photo")) {
                        showItemContent(interactiveItems.photos);
                    }
                }
            }, BABYLON.PointerEventTypes.POINTERDOWN);
            
            // Test 13: Caméra optimale pour la scène
            loadingScreen.innerHTML = `<p>Configuration de la caméra...</p>`;
            camera.dispose(); // Supprimer l'ancienne caméra
            camera = new BABYLON.ArcRotateCamera(
                "camera", 
                -Math.PI / 2,    // Alpha: face à la table
                Math.PI / 3,     // Beta: angle pour voir la table et l'horizon
                4,               // Radius: proche pour être "au bord" de la table
                new BABYLON.Vector3(0, 0.8, 0), // Target: centre de la table
                scene
            );
            
            // Limites de caméra pour une expérience contrôlée
            camera.lowerBetaLimit = Math.PI / 6;   // Ne pas regarder trop vers le bas
            camera.upperBetaLimit = Math.PI / 2.2; // Ne pas regarder trop vers le haut
            camera.lowerRadiusLimit = 2;           // Distance minimale
            camera.upperRadiusLimit = 8;           // Distance maximale
            
            // Contrôles de caméra simples
            let isMouseDown = false;
            let lastMouseX = 0;
            
            canvas.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                lastMouseX = e.clientX;
            });
            
            canvas.addEventListener('mouseup', () => {
                isMouseDown = false;
            });
            
            canvas.addEventListener('mousemove', (e) => {
                if (isMouseDown) {
                    const deltaX = e.clientX - lastMouseX;
                    camera.alpha += deltaX * 0.01;
                    lastMouseX = e.clientX;
                }
            });
            
            canvas.addEventListener('wheel', (e) => {
                camera.radius += e.deltaY * 0.01;
                camera.radius = Math.max(3, Math.min(15, camera.radius));
                e.preventDefault();
            });
            
            // Test final: UNE bougie SUR la table
            loadingScreen.innerHTML = `<p>Ajout de la bougie romantique...</p>`;
            
            // Bougie unique sur la table
            const candle = BABYLON.MeshBuilder.CreateCylinder("candle", {
                height: 0.25,
                diameter: 0.06,
                tessellation: 16
            }, scene);
            
            candle.position.set(0.8, 0.915, 0.3); // SUR la table (même Y que le pot de moutarde)
            
            const candleMat = new BABYLON.StandardMaterial("candleMat", scene);
            candleMat.diffuseColor = new BABYLON.Color3(0.9, 0.85, 0.7);
            candleMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.15);
            candleMat.roughness = 0.8;
            
            candle.material = candleMat;
            candle.receiveShadows = true;
            shadowGenerator.addShadowCaster(candle);
            
            // Flamme animée au-dessus
            const flame = BABYLON.MeshBuilder.CreateSphere("flame", {
                diameter: 0.06,
                segments: 8
            }, scene);
            
            flame.position.set(0.8, 1.05, 0.3); // Au-dessus de la bougie
            flame.scaling.y = 1.5; // Forme de flamme
            
            const flameMat = new BABYLON.StandardMaterial("flameMat", scene);
            flameMat.emissiveColor = new BABYLON.Color3(1.0, 0.6, 0.2);
            flameMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
            flameMat.specularColor = new BABYLON.Color3(0, 0, 0);
            
            flame.material = flameMat;
            
            // Animation de scintillement
            BABYLON.Animation.CreateAndStartAnimation(
                "flameFlicker",
                flame,
                "scaling",
                30,
                60,
                new BABYLON.Vector3(1, 1.5, 1),
                new BABYLON.Vector3(1.2, 1.8, 1.2),
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
            
            // Animation de couleur
            BABYLON.Animation.CreateAndStartAnimation(
                "flameColor",
                flameMat,
                "emissiveColor",
                30,
                90,
                new BABYLON.Color3(1.0, 0.6, 0.2),
                new BABYLON.Color3(1.0, 0.4, 0.1),
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
            );
            
            loadingScreen.innerHTML = `<p>Scène 3D ultra-réaliste prête ! ✨🕯️</p>`;
            
            // Démarrer le rendu
            engine.runRenderLoop(() => {
                scene.render();
            });
            
            // Redimensionnement
            window.addEventListener('resize', () => {
                engine.resize();
            });
            
            // Masquer le loading
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1500);
            
        } catch (error) {
            console.error("Erreur Babylon.js:", error);
            loadingScreen.innerHTML = `
                <p>Erreur Babylon.js: ${error.message}</p>
                <p>Basculement vers CSS 3D...</p>
            `;
            setTimeout(initCSS3DFallback, 1000);
        }
    }
    
    // Commencer les tentatives
    tryInitBabylon();
}

function initCSS3DFallback() {
    const loadingScreen = document.getElementById('loading-3d');
    const canvas = document.getElementById('babylon-canvas');
    
    canvas.style.display = 'none';
    loadingScreen.style.display = 'none';
    
    // Créer une scène CSS 3D simple
    const css3dContainer = document.createElement('div');
    css3dContainer.style.cssText = `
        width: 100%;
        height: 100vh;
        perspective: 1000px;
        background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    `;
    
    css3dContainer.innerHTML = `
        <div style="
            transform-style: preserve-3d;
            transform: rotateX(60deg) rotateY(0deg);
            animation: rotate3d 20s linear infinite;
        ">
            <!-- Table -->
            <div style="
                width: 300px;
                height: 300px;
                background: linear-gradient(135deg, #8B4513, #A0522D);
                border-radius: 50%;
                transform: translateZ(0px);
                position: relative;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            ">
                <!-- Assiette -->
                <div style="
                    width: 120px;
                    height: 120px;
                    background: radial-gradient(circle, #ffffff, #f0f0f0);
                    border-radius: 50%;
                    border: 4px solid #FFD700;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) translateZ(10px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                ">
                    <!-- Fraises -->
                    <div style="
                        width: 12px;
                        height: 15px;
                        background: #DC143C;
                        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                        position: absolute;
                        top: 20%;
                        left: 30%;
                        transform: translateZ(5px);
                    "></div>
                    <div style="
                        width: 12px;
                        height: 15px;
                        background: #DC143C;
                        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                        position: absolute;
                        top: 60%;
                        right: 25%;
                        transform: translateZ(5px);
                    "></div>
                    <div style="
                        width: 12px;
                        height: 15px;
                        background: #DC143C;
                        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                        position: absolute;
                        bottom: 30%;
                        left: 20%;
                        transform: translateZ(5px);
                    "></div>
                </div>
                
                <!-- Pot de moutarde -->
                <div style="
                    width: 25px;
                    height: 30px;
                    background: linear-gradient(to bottom, #FFD700, #FFA500);
                    border-radius: 4px 4px 6px 6px;
                    position: absolute;
                    top: 25%;
                    right: 20%;
                    transform: translateZ(15px);
                    box-shadow: 0 5px 10px rgba(0,0,0,0.3);
                ">
                    <div style="
                        position: absolute;
                        top: 8px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 6px;
                        color: #8B4513;
                        font-weight: bold;
                    ">MOUTARDE</div>
                </div>
                
                <!-- Carte -->
                <div style="
                    width: 60px;
                    height: 80px;
                    background: linear-gradient(145deg, #ffffff, #f8f8f8);
                    border-radius: 4px;
                    position: absolute;
                    top: -20px;
                    left: -80px;
                    transform: translateZ(25px) rotateY(-15deg);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                    border: 2px solid #960018;
                    cursor: pointer;
                " onclick="showItemContent(interactiveItems.card)">
                    <div style="
                        position: absolute;
                        top: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 16px;
                        color: #960018;
                    ">❤️</div>
                </div>
                
                <!-- Photos -->
                <div style="
                    width: 40px;
                    height: 50px;
                    background: linear-gradient(145deg, #ffffff, #f0f0f0);
                    border: 1px solid #333;
                    position: absolute;
                    top: -15px;
                    right: -70px;
                    transform: translateZ(20px) rotateY(10deg) rotateZ(-5deg);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
                    cursor: pointer;
                " onclick="showItemContent(interactiveItems.photos)"></div>
                
                <div style="
                    width: 40px;
                    height: 50px;
                    background: linear-gradient(145deg, #ffffff, #f0f0f0);
                    border: 1px solid #333;
                    position: absolute;
                    top: 10px;
                    right: -90px;
                    transform: translateZ(18px) rotateY(5deg) rotateZ(2deg);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
                    cursor: pointer;
                " onclick="showItemContent(interactiveItems.photos)"></div>
            </div>
        </div>
        
        <style>
            @keyframes rotate3d {
                0% { transform: rotateX(60deg) rotateY(0deg); }
                100% { transform: rotateX(60deg) rotateY(360deg); }
            }
        </style>
    `;
    
    document.getElementById('gift-page').appendChild(css3dContainer);
}

function initFallback3D() {
    // Version fallback sans 3D
    const loadingScreen = document.getElementById('loading-3d');
    const canvas = document.getElementById('babylon-canvas');
    
    canvas.style.display = 'none';
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.cssText = `
        width: 100%;
        height: 100vh;
        background: linear-gradient(135deg, #f5e1ce 0%, #e8d4b7 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Georgia', serif;
        color: #960018;
    `;
    
    fallbackDiv.innerHTML = `
        <h2 style="margin-bottom: 30px;">🎁 Ton Cadeau d'Anniversaire</h2>
        <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 600px; text-align: center;">
            <h3>💝 Message Spécial</h3>
            <p style="font-size: 1.2em; line-height: 1.6; margin: 20px 0;">
                Joyeux anniversaire mon amour ! ❤️<br>
                Cette page était censée être en 3D, mais l'important c'est le message :<br>
                <strong>Tu es la plus belle chose qui me soit arrivée !</strong>
            </p>
            <div style="margin: 30px 0;">
                <button onclick="showCard()" style="background: #960018; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 10px;">
                    📜 Lire la Carte
                </button>
                <button onclick="showPhotos()" style="background: #960018; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 1.1em; cursor: pointer; margin: 10px;">
                    📸 Voir les Photos
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('gift-page').appendChild(fallbackDiv);
    loadingScreen.style.display = 'none';
    
    // Ajouter les fonctions pour les boutons
    window.showCard = () => showItemContent(interactiveItems.card);
    window.showPhotos = () => showItemContent(interactiveItems.photos);
}


// Fonctions simplifiées pour la compatibilité
function showItemContent(item) {
    const ui = document.getElementById('interaction-ui');
    const content = document.getElementById('item-content');
    
    content.innerHTML = `
        <h3>${item.title}</h3>
        ${item.content}
    `;
    
    ui.classList.remove('hidden');
}

function closeItemView() {
    document.getElementById('interaction-ui').classList.add('hidden');
}

