document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mantraInput = document.getElementById('mantraInput');
    const counterCircle = document.getElementById('counterCircle');
    const sessionCountEl = document.getElementById('sessionCount');
    const totalCountEl = document.getElementById('totalCount');
    const streakEl = document.getElementById('streak');

    // App State
    let sessionCount = 0;
    let totalCount = 0;
    let lastVisitDate = null;
    let streak = 0;
    let isCounting = false;

    // Load data from Local Storage
    const loadData = () => {
        const storedMantra = localStorage.getItem('malaMantra');
        if (storedMantra) {
            mantraInput.value = storedMantra;
        }

        totalCount = parseInt(localStorage.getItem('malaTotalCount') || '0', 10);
        totalCountEl.textContent = totalCount;
        
        // Streak Logic
        const today = new Date().toDateString();
        lastVisitDate = localStorage.getItem('malaLastVisit');
        streak = parseInt(localStorage.getItem('malaStreak') || '0', 10);

        if (lastVisitDate) {
            const lastVisit = new Date(lastVisitDate);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastVisit.toDateString() === yesterday.toDateString()) {
                // Continued streak
            } else if (lastVisit.toDateString() !== today) {
                // Streak broken
                streak = 0;
            }
        }
        
        streakEl.textContent = `${streak} days`;
    };

    // Save data to Local Storage
    const saveData = () => {
        localStorage.setItem('malaMantra', mantraInput.value);
        localStorage.setItem('malaTotalCount', totalCount.toString());
        localStorage.setItem('malaStreak', streak.toString());
        localStorage.setItem('malaLastVisit', new Date().toDateString());
    };

    // Update Streak
    const updateStreak = () => {
        const today = new Date().toDateString();
        if (lastVisitDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastVisitDate === yesterday.toDateString()) {
                streak++; // Continued from yesterday
            } else {
                streak = 1; // New streak
            }
            lastVisitDate = today;
            streakEl.textContent = `${streak} days`;
        }
    };
    
    // Haptic Feedback
    const triggerHapticFeedback = () => {
        if (navigator.vibrate) {
            navigator.vibrate(50); // Vibrate for 50ms
        }
    };

    // Counter Click Handler
    const handleCount = () => {
        if (isCounting) return;
        isCounting = true;

        // Update counts
        sessionCount++;
        totalCount++;
        
        // Update UI
        sessionCountEl.textContent = sessionCount;
        totalCountEl.textContent = totalCount;
        
        // Animate and provide feedback
        counterCircle.classList.add('animating');
        counterCircle.classList.add('disabled');
        triggerHapticFeedback();
        updateStreak();

        // Save data after count
        saveData();

        // Reset after 0.8s delay
        setTimeout(() => {
            counterCircle.classList.remove('animating');
            counterCircle.classList.remove('disabled');
            isCounting = false;
        }, 800);
    };

    // Event Listeners
    counterCircle.addEventListener('click', handleCount);
    mantraInput.addEventListener('input', saveData);

    // Initial Load
    loadData();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        });
    }
});
