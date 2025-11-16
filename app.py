from flask import Flask, render_template
from config import config
import os

def create_app(config_name='development'):
    """Factory para crear la aplicación Flask"""
    app = Flask(__name__)
    
    # Configuración
    config_obj = config.get(config_name, config['development'])
    app.config.from_object(config_obj)
    
    # Registrar rutas
    _register_routes(app)
    
    return app

def _register_routes(app):
    """Registrar todas las rutas de la aplicación"""
    
    # Página de inicio
    @app.route('/')
    def index():
        """Página de inicio con botón empezar"""
        return render_template('inicio.html')
    
    # Página informativa de paneles
    @app.route('/paneles')
    def paneles():
        """Página con paneles de Power BI"""
        return render_template('paneles.html')
    
    # Panel 1 - Ventas
    @app.route('/panel/Resumen')
    def panel_resumen():
        """Panel de Ventas"""
        return render_template('panel_Resumen.html')
    
    # Panel 2 - Inventario
    @app.route('/panel/Analisis')
    def panel_analisis():
        """Panel de Inventario"""
        return render_template('panel_Analisis.html')
    
    # Panel 3 - Operaciones
    @app.route('/panel/Temporal')
    def panel_temporal():
        """Panel de Operaciones"""
        return render_template('panel_Temporal.html')
    
    # Panel 4 - Reportes
    @app.route('/panel/reportes')
    def panel_reportes():
        """Panel de Reportes"""
        return render_template('panel_reportes.html')
    
    # Acerca de
    @app.route('/acerca-de')
    def acerca_de():
        """Página de información"""
        return render_template('acerca_de.html')

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    app.run(debug=True, host='0.0.0.0', port=5000)