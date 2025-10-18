document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('germination-video');
    const container = document.querySelector('.seed-container');
    const conceptText = document.getElementById('concept-text');
    
    let isPlaying = false;

    // ===========================================
    // 1. INICIALIZACIÓN: FORZAR CARGA Y PAUSA
    //    (Asegura que la semilla aparezca al inicio)
    // ===========================================

    // Intentamos reproducir para forzar la carga y el 'muted' (silencio)
    video.load(); 
    video.play().catch(() => {
        // La Promesa falla, pero la carga se inicia.
    });

    // Aseguramos el estado inicial: pausado en el frame 0 (la semilla)
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0; 
        video.pause();
    });
    
    // Fallback de pausa por si loadedmetadata tarda
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
        conceptText.classList.add('concept-text-visible');

        video.playbackRate = 1.0; 
        
        video.play().catch(error => {
             console.error("Error al intentar reproducir:", error);
             isPlaying = false;
             conceptText.classList.remove('concept-text-visible');
        });

        // Detenemos el video al llegar al final del ciclo de germinación
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
        isPlaying = false;
        conceptText.classList.remove('concept-text-visible');
        
        video.pause();
        
        // Regresa el video al frame de la semilla (rápido y confiable)
        setTimeout(() => {
            if (!isPlaying) { 
                video.currentTime = 0; 
            }
        }, 100); 
    };

    // ===========================================
    // 4. LÓGICA CLAVE: INTERACCIÓN DE ALTERNANCIA (TOGGLE)
    // ===========================================

    const handleToggleInteraction = (e) => {
        // Prevenir el comportamiento por defecto (scroll/zoom) en touch y mouse
        e.preventDefault(); 
        
        // Si el video está en estado de semilla (o muy cerca del inicio)
        if (video.currentTime < 0.1) {
            playGermination();
        } else {
            // Si está germinando o ha terminado, lo regresamos a semilla
            pauseGermination();
        }
    };

    // Asignación de Eventos
    
    // Desktop: Mouse Clic (Es más robusto que el hover para esta lógica de toggle)
    container.addEventListener('click', handleToggleInteraction);
    
    // Móvil: Touch (Usamos solo touchstart para alternar en un solo toque)
    container.addEventListener('touchstart', handleToggleInteraction, { passive: false });
    
    // Removemos mouseover/mouseout para evitar conflictos con la lógica de click/touch
});
