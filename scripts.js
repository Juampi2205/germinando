document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('germination-video');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;

    // ===========================================
    // 1. INICIALIZACIÓN Y SEGURIDAD
    // ===========================================
    
    // CLAVE DE SEGURIDAD: Aseguramos que el texto esté oculto al iniciar (solución al 3er problema)
    conceptText.classList.remove('concept-text-visible');
    conceptText.classList.add('concept-text-hidden');

    // Intentamos reproducir para forzar la carga (y luego pausamos)
    video.load(); 
    video.play().catch(() => {
        // Ignoramos errores de autoplay que fallan, pero la carga se inicia.
    });

    // Aseguramos el estado inicial: pausado en el frame 0 (la semilla)
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0; 
        video.pause();
    });
    
    // Fallback de pausa si loadedmetadata tarda
    setTimeout(() => {
        if (video.currentTime === 0) {
            video.pause();
        }
    }, 100); 

    // ===========================================
    // 2. Lógica de Germinación (Avanzar el video)
    // ===========================================
    const playGermination = () => {
        if (isPlaying) return; 
        
        isPlaying = true;
        conceptText.classList.remove('concept-text-hidden');
        conceptText.classList.add('concept-text-visible');

        video.playbackRate = 1.0; 
        
        video.play().catch(error => {
             console.error("Error al intentar reproducir:", error);
             isPlaying = false;
             conceptText.classList.add('concept-text-hidden');
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
    // 3. Lógica de Retraimiento (Volver al inicio)
    // ===========================================
    const pauseGermination = () => {
        video.pause();
        isPlaying = false;
        
        conceptText.classList.remove('concept-text-visible');
        conceptText.classList.add('concept-text-hidden');
        
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
        
        // Si el video está en estado de semilla (o muy cerca del inicio), inicia la germinación
        if (video.currentTime < 0.1) {
            playGermination();
        } else {
            // Si ya germinó o está en reproducción, lo regresa a semilla
            pauseGermination();
        }
    };

    // Asignación de Eventos
    container.addEventListener('click', handleToggleInteraction);
    container.addEventListener('touchstart', handleToggleInteraction, { passive: false });
});
