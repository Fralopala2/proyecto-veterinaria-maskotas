// Sistema de tracking de conexiones para usuarios registrados
class ConnectionTracker {
    constructor() {
        this.connectionId = null;
        this.startTime = null;
        this.isTracking = false;
        this.init();
    }

    init() {
        // Iniciar tracking cuando la página carga
        this.startConnection();
        
        // Configurar eventos para finalizar conexión
        this.setupEventListeners();
    }

    startConnection() {
        // Solo trackear si hay un usuario logueado (esto se puede expandir)
        // Por ahora, trackear todas las visitas para demostración
        
        this.startTime = new Date();
        this.isTracking = true;
        
        // Generar un ID único para esta sesión
        this.connectionId = this.generateConnectionId();
        
        console.log('Connection tracking started:', this.connectionId);
        
        // Opcional: Enviar evento de inicio de conexión al servidor
        // this.sendConnectionStart();
    }

    setupEventListeners() {
        // Detectar cuando el usuario sale de la página
        window.addEventListener('beforeunload', () => {
            this.endConnection();
        });

        // Detectar cuando la página se oculta (cambio de pestaña, etc.)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isTracking) {
                this.endConnection();
            } else if (!document.hidden && !this.isTracking) {
                this.startConnection();
            }
        });

        // Detectar inactividad prolongada (opcional)
        this.setupInactivityDetection();
    }

    setupInactivityDetection() {
        let inactivityTimer;
        const inactivityTime = 30 * 60 * 1000; // 30 minutos

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (this.isTracking) {
                    console.log('User inactive, ending connection tracking');
                    this.endConnection();
                }
            }, inactivityTime);
        };

        // Eventos que indican actividad del usuario
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    endConnection() {
        if (!this.isTracking || !this.startTime) {
            return;
        }

        const endTime = new Date();
        const duration = Math.round((endTime - this.startTime) / 1000); // duración en segundos

        console.log(`Connection ended. Duration: ${duration} seconds`);

        // Enviar datos al servidor
        this.sendConnectionEnd(duration);

        this.isTracking = false;
        this.startTime = null;
    }

    async sendConnectionEnd(duration) {
        try {
            // Usar sendBeacon para envío confiable al cerrar página
            const data = new FormData();
            data.append('connection_id', this.connectionId);
            data.append('duration', duration);
            data.append('end_time', new Date().toISOString());

            if (navigator.sendBeacon) {
                navigator.sendBeacon('http://44.220.146.193/api/update-connection-end.php', data);
            } else {
                // Fallback para navegadores que no soportan sendBeacon
                fetch('http://44.220.146.193/api/update-connection-end.php', {
                    method: 'POST',
                    body: data,
                    keepalive: true
                }).catch(error => {
                    console.error('Error sending connection data:', error);
                });
            }
        } catch (error) {
            console.error('Error in sendConnectionEnd:', error);
        }
    }

    generateConnectionId() {
        return 'conn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Método público para obtener estadísticas de la sesión actual
    getSessionStats() {
        if (!this.isTracking || !this.startTime) {
            return null;
        }

        const currentTime = new Date();
        const duration = Math.round((currentTime - this.startTime) / 1000);

        return {
            connectionId: this.connectionId,
            startTime: this.startTime,
            currentDuration: duration,
            isActive: this.isTracking
        };
    }
}

// Inicializar el tracker cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.connectionTracker = new ConnectionTracker();
});

// Función global para obtener estadísticas (útil para debugging)
window.getConnectionStats = () => {
    return window.connectionTracker ? window.connectionTracker.getSessionStats() : null;
};