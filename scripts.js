document.addEventListener('DOMContentLoaded', () => {
    const imageElement = document.getElementById('germination-image');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;
    let currentFrame = 0;
    let animationInterval;
    
    // ===========================================
    // 1. CONFIGURACIÓN DE ANIMACIÓN FRAME-BY-FRAME
    // ===========================================
    
    // ARRAY DE IMÁGENES:
    const frames = [
        'img/1.jpeg', 
        'img/2.jpeg',
        'img/3.jpeg',
        'img/4.jpeg',
        'img/5.jpeg',
        'img/6.jpeg',
        'img/7.jpeg' 
    ];
    const totalFrames = frames.length;
    // CLAVE: 660ms por frame para una duración total de ~4 segundos.
    const FRAME_RATE = 660; 

    // Precarga todas las imágenes (para evitar parpadeos)
    frames.forEach(src => {
        new Image().src = src;
    });

    // ===========================================
    // 2. Lógica de Germinación (Avanzar Frames)
    // ===========================================
    const startGermination = () => {
        if (isPlaying) return;
        
        isPlaying = true;
        conceptText.classList.add('concept-text-visible');

        // Configura un intervalo para cambiar el frame (simula la reproducción)
        animationInterval = setInterval(() => {
            currentFrame++;
            
            if (currentFrame >= totalFrames) {
                // Si llega al final, detiene el ciclo en el último frame
                currentFrame = totalFrames - 1;
                clearInterval(animationInterval);
                isPlaying = false; 
            }
            
            imageElement.src = frames[currentFrame];
            
        }, FRAME_RATE);
    };

    // ===========================================
    // 3. Lógica de Retraimiento (Volver a Semilla)
    // ===========================================
    const resetGermination = () => {
        if (animationInterval) {
            clearInterval(animationInterval); // Detiene cualquier animación en curso
        }
        isPlaying = false;
        conceptText.classList.remove('concept-text-visible');
        
        // Vuelve al primer frame (la semilla)
        currentFrame = 0;
        imageElement.src = frames[currentFrame];
    };

    // ===========================================
    // 4. INTERACCIÓN DE ALTERNANCIA (TOGGLE)
    // ===========================================
    
    const handleToggleInteraction = (e) => {
        e.preventDefault(); 
        
        // Si no está en el primer frame (o ya terminó la animación), resetea
        if (currentFrame > 0) {
            resetGermination();
        } else {
            // Si está en el primer frame, inicia la germinación
            startGermination();
        }
    };

    // Asignación de Eventos
    
    // Desktop: Click para alternar
    container.addEventListener('click', handleToggleInteraction);
    
    // Móvil: Touch (Usamos solo touchstart)
    container.addEventListener('touchstart', handleToggleInteraction, { passive: false });
    
    // Aseguramos que inicie en el estado de semilla
    imageElement.src = frames[0];
});
