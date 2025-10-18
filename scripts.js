document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('germination-video');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;

    // ===========================================
    // INICIALIZACIÓN: FORZAR CARGA Y PAUSA (ROBUSTO)
    // ===========================================

    // Intentamos reproducir para forzar la carga (y luego pausamos)
    video.load(); 
    video.play().catch(() => {
        // La promesa falla si el navegador lo bloquea, pero la carga se inicia.
    });

    // Aseguramos el estado inicial de la semilla (pausado en frame 0)
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
    // Lógica de Germinación (Avanzar el video)
    // ===========================================
    const playGermination = () => {
        if (isPlaying) return; 
        
        isPlaying = true;
        conceptText.classList.add('concept-text-visible');

        video.playbackRate = 1.0; 
        
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
        // Detiene el video
        video.pause();
        isPlaying = false;
        conceptText.classList.remove('concept-text-visible');
        
        // Regresa el video al frame de la semilla (más rápido para móvil)
        setTimeout(() => {
            if (!isPlaying) { 
                video.currentTime = 0; 
            }
        }, 100); // 💡 CLAVE: 100ms para que la respuesta al levantar el dedo sea casi instantánea
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
        // No prevenimos el default aquí para que el navegador maneje la interacción base
        pauseGermination();
    });
});
