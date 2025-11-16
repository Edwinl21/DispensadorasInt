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
    
    @app.route('/')
    def index():
        return render_template('inicio.html')
    
    @app.route('/paneles')
    def paneles():
        return render_template('paneles.html')
    
    @app.route('/panel/Resumen')
    def panel_resumen():
        return render_template('panel_Resumen.html')
    
    @app.route('/panel/Analisis')
    def panel_analisis():
        return render_template('panel_Analisis.html')
    
    @app.route('/panel/Temporal')
    def panel_temporal():
        return render_template('panel_Temporal.html')
    
    @app.route('/panel/reportes')
    def panel_reportes():
        return render_template('panel_reportes.html')
    
    @app.route('/acerca-de')
    def acerca_de():
        return render_template('acerca_de.html')


app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
