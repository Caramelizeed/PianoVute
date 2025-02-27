document.addEventListener('DOMContentLoaded', () => {
    // Audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Piano key mappings (keyboard to piano keys)
    const keyMap = {
        'a': 'C4',
        'w': 'C#4',
        's': 'D4',
        'e': 'D#4',
        'd': 'E4',
        'f': 'F4',
        't': 'F#4',
        'g': 'G4',
        'y': 'G#4',
        'h': 'A4',
        'u': 'A#4',
        'j': 'B4',
        'k': 'C5'
    };

    // Frequencies for notes
    const noteFrequencies = {
        'C4': 261.63,
        'C#4': 277.18,
        'D4': 293.66,
        'D#4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'F#4': 369.99,
        'G4': 392.00,
        'G#4': 415.30,
        'A4': 440.00,
        'A#4': 466.16,
        'B4': 493.88,
        'C5': 523.25
    };

    // Get all keys
    const keys = document.querySelectorAll('.key');
    
    // Function to play a note
    function playNote(note) {
        // Create oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Set oscillator type and frequency
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(noteFrequencies[note], audioContext.currentTime);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Envelope for cute sound
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.02);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
        
        // Start and stop
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
        
        // Add sparkle effect
        addSparkle(note);
    }
    
    // Function to add visual sparkle effect
    function addSparkle(note) {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (!keyElement) return;
        
        // Create sparkle element
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Position sparkle randomly within the key
        const keyRect = keyElement.getBoundingClientRect();
        const x = Math.random() * keyRect.width;
        const y = Math.random() * keyRect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        // Add to key and remove after animation
        keyElement.appendChild(sparkle);
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
    
    // Add animation to decorative elements
    function animateDecorations() {
        const decorations = document.querySelectorAll('.star, .heart');
        decorations.forEach(item => {
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 2;
            item.style.animationDelay = `${delay}s`;
            item.style.animationDuration = `${duration}s`;
        });
    }
    
    // Click events for piano keys
    keys.forEach(key => {
        if (key.dataset.note) {
            key.addEventListener('mousedown', () => {
                playNote(key.dataset.note);
                key.classList.add('active');
            });
            
            key.addEventListener('mouseup', () => {
                key.classList.remove('active');
            });
            
            key.addEventListener('mouseleave', () => {
                key.classList.remove('active');
            });
        }
    });
    
    // Keyboard events
    document.addEventListener('keydown', (event) => {
        // Prevent repeating on key hold
        if (event.repeat) return;
        
        const key = event.key.toLowerCase();
        if (keyMap[key]) {
            const note = keyMap[key];
            playNote(note);
            
            // Add active class to the corresponding key
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }
        }
    });
    
    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (keyMap[key]) {
            const note = keyMap[key];
            
            // Remove active class
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
            }
        }
    });
    
    // Initialize decoration animations
    animateDecorations();
});