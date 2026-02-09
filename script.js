'use strict';

/**
 * SportsHub Live Score Simulation Engine
 * Handles real-time score updates, UI transitions, and match logic.
 */

// Initial Data Model
const matches = [
    { 
        id: 1, 
        sport: 'Football', 
        teamA: 'Manchester Knights', 
        teamB: 'London Warriors', 
        scoreA: 0, 
        scoreB: 1, 
        status: 'Live',
        maxScore: 5 
    },
    { 
        id: 2, 
        sport: 'Basketball', 
        teamA: 'LA Lakers', 
        teamB: 'Boston Celtics', 
        scoreA: 72, 
        scoreB: 68, 
        status: 'Live',
        maxScore: 130 
    },
    { 
        id: 3, 
        sport: 'Tennis', 
        teamA: 'C. Alcaraz', 
        teamB: 'N. Djokovic', 
        scoreA: 30, 
        scoreB: 40, 
        status: 'Live',
        points: ['0', '15', '30', '40', 'AD'] 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Simulation Engine ---
    
    /**
     * Increments score based on sport-specific logic
     */
    function updateRandomMatch() {
        const randomIndex = Math.floor(Math.random() * matches.length);
        const match = matches[randomIndex];

        // Don't update if match is "finished" (simulated threshold)
        if (match.status === 'Final') return;

        const side = Math.random() > 0.5 ? 'a' : 'b';
        const scoreKey = side === 'a' ? 'scoreA' : 'scoreB';
        const scoreElementId = `score-${match.id}-${side}`;
        const scoreElement = document.getElementById(scoreElementId);

        if (!scoreElement) return;

        // Logic by Sport
        if (match.sport === 'Football') {
            match[scoreKey]++;
            animateScoreUpdate(scoreElement, match[scoreKey]);
        } 
        else if (match.sport === 'Basketball') {
            const increment = Math.random() > 0.3 ? 2 : 3;
            match[scoreKey] += increment;
            animateScoreUpdate(scoreElement, match[scoreKey]);
        } 
        else if (match.sport === 'Tennis') {
            updateTennisScore(match, side, scoreElement);
        }

        // Check for Final state simulation
        if (match.sport !== 'Tennis' && (match.scoreA > match.maxScore || match.scoreB > match.maxScore)) {
            match.status = 'Final';
        }
    }

    /**
     * Special logic for tennis point progression (0, 15, 30, 40, AD)
     */
    function updateTennisScore(match, side, element) {
        const currentIndex = match.points.indexOf(match[side === 'a' ? 'scoreA' : 'scoreB'].toString());
        let nextIndex = currentIndex + 1;

        if (nextIndex >= match.points.length) {
            // Reset to 0 for simulation purposes (new game)
            match.scoreA = 0;
            match.scoreB = 0;
            animateScoreUpdate(document.getElementById(`score-${match.id}-a`), 0);
            animateScoreUpdate(document.getElementById(`score-${match.id}-b`), 0);
        } else {
            const nextPoint = match.points[nextIndex];
            match[side === 'a' ? 'scoreA' : 'scoreB'] = nextPoint;
            animateScoreUpdate(element, nextPoint);
        }
    }

    /**
     * Visual feedback for score updates
     */
    function animateScoreUpdate(element, newValue) {
        element.textContent = newValue;
        element.classList.add('score-update');
        
        // Remove class after animation finishes
        setTimeout(() => {
            element.classList.remove('score-update');
        }, 600);
    }

    // Start Simulation: Run every 15 to 30 seconds
    const startSimulation = () => {
        const interval = Math.floor(Math.random() * (30000 - 15000 + 1) + 15000);
        setTimeout(() => {
            updateRandomMatch();
            startSimulation();
        }, interval);
    };

    startSimulation();


    // --- 2. Smooth Scrolling ---
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // --- 3. Interaction & Accessibility ---

    // Ensure ARIA live region is working by updating a hidden descriptive tag 
    // when high-stakes changes occur (optional enhancement)
    function announceUpdate(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.classList.add('sr-only');
        announcement.textContent = text;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Header scroll background toggle
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

});

// Helper for Screen Readers (CSS added to head)
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);