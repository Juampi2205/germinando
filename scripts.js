document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('germination-video');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;

    // ===========================================
    // INICIALIZACIÓN: FORZAR CARGA Y PAUSA
    // ===========================================

    // CLAVE: Intentamos reproducir inmediatamente para forzar la carga (y luego pausamos)
    video.load(); 
    video.play().catch(() => {
        // La promesa falla si el navegador lo bloquea, pero la carga se inicia.
    });

    // Aseguramos el estado inicial de la semilla (pausado en frame 0)
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0; 
        video.pause();
    });
    
    // Fallback de pausa si loadedmetadata tarda o falla
    setTimeout(() => {
        if (video.currentTime === 0) {
            video.pause();
        }
    }, 100); 

    // ===========================================
    // Lógica de Germinación (Avanzar el video)
    // ===========================================
    const playGermination = () => {
        // Solo reproduce si no se está reproduciendo ya
        if (isPlaying) return; 
        
        isPlaying = true;
        conceptText.classList.add('concept-text-visible');

        video.playbackRate = 1.0; 
        
        // Intentamos reproducir (la reproducción ahora SÍ funcionará porque ya se intentó una vez al inicio)
        video.play().catch(error => {
             console.error("Error al intentar reproducir:", error);
             isPlaying = false;
             conceptText.classList.remove('concept-text-visible');
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
    // Lógica de Retraimiento (Volver al inicio)
    // ===========================================
    const pauseGermination = () => {
        isPlaying = false;
        conceptText.classList.remove('concept-text-visible');
        
        video.pause();
        
        // Regresa el video al frame de la semilla
        setTimeout(() => {
            if (!isPlaying) { 
                video.currentTime = 0; 
            }
        }, 500); 
    };

    // ===========================================
    // Asignación de Eventos (Desktop y Móvil)
    // ===========================================

    // Desktop: Mouse Hover
    container.addEventListener('mouseover', playGermination);
    container.addEventListener('mouseout', pauseGermination);
    
    // Móvil: Touch (tocar la pantalla)
    container.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        playGermination();
    });
    
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        pauseGermination();
    });
});