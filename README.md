# Site d'Anniversaire ❤️

Un site interactif en 3 pages pour l'anniversaire de ta copine !

## 🎯 Structure du site

### Page 1 : Accueil
- Message "Joyeux Anniversaire" avec tes couleurs (#f5e1ce et #960018)
- Bouton "Découvrir le cadeau"
- Décorations en forme de cœurs animés

### Page 2 : QCM
- Message personnalisable avant le jeu
- Questions qui apparaissent une par une
- Score final (elle gagne toujours !)

### Page 3 : Cadeau 3D
- Scène 3D avec plage, table et objets interactifs
- Carte d'anniversaire cliquable
- Photos de vous deux
- Assiette avec fraises et moutarde 😄

## 🛠️ Personnalisation

### Modifier les questions du QCM
Dans `script.js`, trouve la section `quizData` et modifie :
```javascript
const quizData = [
    {
        question: "Ta question ici ?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3", "Réponse 4"],
        correct: 0 // Index de la bonne réponse (0, 1, 2 ou 3)
    },
    // Ajoute d'autres questions...
];
```

### Modifier le message d'introduction du QCM
Dans `index.html`, trouve la classe `intro-message` et modifie le texte.

### Modifier la lettre d'amour
Dans `script.js`, trouve `interactiveItems.card.content` et personnalise le message.

### Ajouter tes photos
1. Place tes photos dans le dossier du projet
2. Dans `script.js`, trouve `interactiveItems.photos.content`
3. Remplace les URLs par tes vraies photos :
```javascript
<img src="photo1.jpg" alt="Notre photo 1">
```

## 🚀 Déploiement gratuit

Le site est prêt à être déployé sur Netlify gratuitement !

## 🎨 Couleurs utilisées
- Fond : `#f5e1ce` (beige doux)
- Accents : `#960018` (rouge profond)
- Blanc pour les cartes et éléments

## 📱 Responsive
Le site s'adapte automatiquement aux mobiles et tablettes.

## ❤️ Fonctionnalités spéciales
- Animations de cœurs
- Transitions fluides entre les pages
- QCM interactif avec feedback visuel
- Scène 3D immersive
- Éléments cliquables dans la scène 3D

Bonne personnalisation ! 🎉
