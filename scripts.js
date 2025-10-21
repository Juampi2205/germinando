document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('germination-video');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;

    // ===========================================
    // 1. INICIALIZACIÓN: FORZAR CARGA Y PAUSA
    //    (El video DEBE tener el atributo 'muted' quitado del HTML para que esto funcione)
    // ===========================================

    // Intentamos reproducir para forzar la carga (y luego pausamos)
    video.load(); 
    video.play().catch(() => {}); // Intentamos play, pero ignoramos el error

    // Aseguramos el estado inicial: pausado en el frame 0 (la semilla)
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0; 
        video.pause();
        // CLAVE: Aseguramos que inicie silenciado, aunque no esté el atributo 'muted' en el HTML
        video.muted = true; 
    });
    
    // Fallback de pausa si loadedmetadata tarda
    setTimeout(() => {
        if (video.currentTime === 0) {
            video.pause();
        }
    }, 100); 

    // ===========================================
    // 2. Lógica de Germinación (Avanzar el video y Activar Sonido)
    // ===========================================
    const playGermination = () => {
        if (isPlaying) return; 
        
        isPlaying = true;
        conceptText.classList.remove('concept-text-hidden');
        conceptText.classList.add('concept-text-visible');

        // CLAVE: Activamos el sonido al inicio de la interacción
        video.muted = false; 

        video.playbackRate = 1.0; 
        
        video.play().catch(error => {
             console.error("Error al intentar reproducir:", error);
             isPlaying = false;
             conceptText.classList.add('concept-text-hidden');
             video.muted = true; // Silenciamos en caso de error
        });

        // Detenemos el video al llegar al final
        const stopAtEnd = () => {
            if (video.currentTime >= video.duration - 0.1) {
                video.pause();
                video.removeEventListener('timeupdate', stopAtEnd);
            }
        };
        video.addEventListener('timeupdate', stopAtEnd);
    };

    // ===========================================
    // 3. Lógica de Retraimiento (Volver al inicio y Silenciar)
    // ===========================================
    const pauseGermination = () => {
        video.pause();
        isPlaying = false;
        
        conceptText.classList.remove('concept-text-visible');
        conceptText.classList.add('concept-text-hidden');
        
        // CLAVE: Volvemos a silenciarlo antes de reiniciar el frame
        video.muted = true; 

        // Regresa el video al frame de la semilla (rápido para móvil)
        setTimeout(() => {
            if (!isPlaying) { 
                video.currentTime = 0; 
            }
        }, 100); 
    };

    // ===========================================
    // 4. INTERACCIÓN DE ALTERNANCIA (TOGGLE)
    // ===========================================
    
    const handleToggleInteraction = (e) => {
        e.preventDefault(); 
        
        // Si el video está en estado de semilla, inicia la germinación
        if (video.currentTime < 0.1) {
            playGermination();
        } else {
            // Si ya germinó, lo regresa a semilla
            pauseGermination();
        }
    };

    // Asignación de Eventos (Click y Touch)
    container.addEventListener('click', handleToggleInteraction);
    container.addEventListener('touchstart', handleToggleInteraction, { passive: false });
});
