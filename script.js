document.addEventListener('DOMContentLoaded', () => {
    const mainCircle = document.getElementById('mainCircle');
    const countDisplay = document.getElementById('countDisplay');
    const modeDisplay = document.getElementById('modeDisplay');
    const progressRing = document.getElementById('progressRing');
    const malaModeBtn = document.getElementById('malaModeBtn');
    const targetBtn = document.getElementById('targetBtn');
    const resetBtn = document.getElementById('resetBtn');
    const feedbackBtn = document.getElementById('feedbackBtn');
    const themeBtn = document.getElementById('themeBtn');
    const radius = progressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    // --- State Management ---
    let state = {
        count: parseInt(localStorage.getItem('malaCount') || '0', 10),
        isCounting: false,
        mode: 'infinite', // 'infinite', 'mala', 'target'
        target: 0,
        feedback: localStorage.getItem('malaFeedback') || 'sound', // 'sound', 'haptic', 'none'
        theme: localStorage.getItem('malaTheme') || 'light',
    };

    // --- Initialization ---
    const init = () => {
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        updateUI();
        detectTheme();
    };

    // --- Core Functions ---
    const handleCount = () => {
        if (state.isCounting) return;
        state.isCounting = true;
        mainCircle.classList.add('disabled');

        state.count++;
        localStorage.setItem('malaCount', state.count);

        playFeedback();
        updateUI();
        checkCompletion();

        setTimeout(() => {
            state.isCounting = false;
            mainCircle.classList.remove('disabled');
        }, 800);
    };

    const playFeedback = () => {
        if (state.feedback === 'haptic' && navigator.vibrate) {
            navigator.vibrate(50);
        } else if (state.feedback === 'sound') {
            new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3').play();
        }
    };
    
    const playCompletionFeedback = () => {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3').play();
    };

    const checkCompletion = () => {
        if ((state.mode === 'mala' && state.count % 108 === 0 && state.count > 0) || (state.mode === 'target' && state.count === state.target)) {
            playCompletionFeedback();
            // Optional: reset or pause
        }
    };

    // --- UI Updates ---
    const updateUI = () => {
        countDisplay.textContent = state.count;
        let progress = 0;
        
        switch (state.mode) {
            case 'mala':
                progress = (state.count % 108) / 108;
                modeDisplay.textContent = `Mala: ${Math.floor(state.count / 108)} / Round: ${state.count % 108}`;
                break;
            case 'target':
                progress = state.count / state.target;
                modeDisplay.textContent = `Target: ${state.count} / ${state.target}`;
                if (state.count >= state.target) progress = 1;
                break;
            default:
                modeDisplay.textContent = '';
                progress = 0; // or make it pulse, etc.
        }
        
        const offset = circumference - Math.min(progress, 1) * circumference;
        progressRing.style.strokeDashoffset = offset;
    };

    // --- Theme Management ---
    const detectTheme = () => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('malaTheme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }
    };

    const setTheme = (theme) => {
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('malaTheme', theme);
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    };

    const toggleTheme = () => {
        setTheme(state.theme === 'light' ? 'dark' : 'light');
    };

    // --- Event Listeners ---
    mainCircle.addEventListener('click', handleCount);
    
    malaModeBtn.addEventListener('click', () => {
        state.mode = 'mala';
        state.target = 108;
        updateUI();
    });

    targetBtn.addEventListener('click', () => {
        const newTarget = prompt("Set your target count:", state.target || 108);
        if (newTarget && !isNaN(newTarget) && newTarget > 0) {
            state.mode = 'target';
            state.target = parseInt(newTarget, 10);
            updateUI();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your total count to zero?')) {
            state.count = 0;
            localStorage.setItem('malaCount', '0');
            updateUI();
        }
    });

    feedbackBtn.addEventListener('click', () => {
        const feedbacks = ['sound', 'haptic', 'none'];
        const currentIndex = feedbacks.indexOf(state.feedback);
        state.feedback = feedbacks[(currentIndex + 1) % feedbacks.length];
        localStorage.setItem('malaFeedback', state.feedback);
        feedbackBtn.textContent = state.feedback === 'sound' ? '🔊' : state.feedback === 'haptic' ? '📳' : '🔇';
    });

    themeBtn.addEventListener('click', toggleTheme);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
        });
    }

    // Initial call
    init();
});
