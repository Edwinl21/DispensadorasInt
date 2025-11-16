# Sistema de Paneles Inteligentes - Power BI Showcase

Aplicación web ligera construida con Flask para visualizar paneles de Power BI exportados. Diseñada específicamente para mostrar reportes de inteligencia de negocios de dispensadoras automatizadas con una interfaz moderna y profesional.

## 🎯 Características Principales

- **Landing Page Profesional**: Página de inicio con diseño moderno y animaciones
- **Galería de Paneles**: Interfaz intuitiva para acceder a diferentes reportes
- **Integración Power BI**: Embebimiento de reportes de Power BI directamente en la aplicación
- **Base de Datos en la Nube**: Soporte para múltiples proveedores (MySQL, PostgreSQL, SQL Server)
- **Diseño Responsivo**: Compatible con dispositivos móviles y de escritorio
- **Interfaz Profesional**: Construida con Bootstrap 5 y Font Awesome

## 📋 Páginas Disponibles

1. **Inicio** (`/`) - Landing page con botón "Empezar"
2. **Paneles** (`/paneles`) - Galería de 4 paneles disponibles:
   - **Ventas** (`/panel/ventas`) - Análisis de ventas e ingresos
   - **Inventario** (`/panel/inventario`) - Gestión de stock y disponibilidad
   - **Operaciones** (`/panel/operaciones`) - KPIs operacionales
   - **Reportes** (`/panel/reportes`) - Reportes ejecutivos consolidados
3. **Acerca de** (`/acerca-de`) - Información del proyecto y equipo

## 🏗️ Estructura del Proyecto

```
DispensadorasInt/
├── app.py                    # Aplicación Flask principal (simplificada)
├── config.py                 # Configuración y variables de entorno
├── requeriment.txt          # Dependencias Python
├── .env.example             # Variables de entorno de ejemplo
├── static/
│   ├── css/
│   │   ├── main.css         # Estilos principales
│   │   └── styles.css       # Estilos adicionales
│   └── js/
│       └── main.js          # JavaScript principal
└── templates/
    ├── inicio.html          # Landing page con navbar
    ├── paneles.html         # Galería de paneles
    ├── panel_base.html      # Plantilla base para paneles
    ├── panel_ventas.html    # Panel de ventas
    ├── panel_inventario.html # Panel de inventario
    ├── panel_operaciones.html # Panel de operaciones
    ├── panel_reportes.html   # Panel de reportes
    ├── acerca_de.html       # Página de información
    └── layout.html          # Plantilla base alternativa
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Flask 3.0.0** - Framework web Python
- **Python 3.x** - Lenguaje de programación
- **python-dotenv** - Gestión de variables de entorno
- **PyMySQL** - Driver para conexiones MySQL

### Frontend
- **Bootstrap 5.3.0** - Framework CSS
- **Font Awesome 6.4.0** - Iconos
- **JavaScript vanilla** - Interactividad
- **CSS3** - Animaciones y estilos modernos

### Bases de Datos
- **MySQL** - Compatible con AWS RDS, Google Cloud SQL, etc.
- **PostgreSQL** - Compatible con múltiples proveedores cloud
- **SQL Server** - Soporte para Azure SQL Database

### Integración
- **Power BI** - Embebimiento de reportes y dashboards

## 🚀 Instalación y Configuración

### Paso 1: Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd DispensadorasInt
```

### Paso 2: Crear Entorno Virtual

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Paso 3: Instalar Dependencias

```bash
pip install -r requeriment.txt
```

### Paso 4: Configurar Variables de Entorno

1. Copiar el archivo de ejemplo:
   ```bash
   copy .env.example .env
   ```

2. Editar `.env` con tus valores:

   **Para MySQL:**
   ```env
   FLASK_ENV=development
   DATABASE_URL=mysql+pymysql://usuario:contraseña@hostname:3306/nombre_basedatos
   POWERBI_REPORT_ID=tu-report-id
   POWERBI_WORKSPACE_ID=tu-workspace-id
   ```

   **Para PostgreSQL:**
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@hostname:5432/nombre_basedatos
   ```

   **Para Azure SQL Database:**
   ```env
   DATABASE_URL=mssql+pyodbc://usuario:contraseña@servidor.database.windows.net/nombre_basedatos?driver=ODBC+Driver+17+for+SQL+Server
   ```

### Paso 5: Ejecutar la Aplicación

```bash
python app.py
```

La aplicación estará disponible en `http://localhost:5000`

## 📊 Configuración de Power BI

Para embeber tus reportes de Power BI, sigue estos pasos:

1. **Generar URLs de embebimiento en Power BI:**
   - Abre tu reporte en Power BI Service
   - Haz clic en "Compartir" o "Embed"
   - Copia el código de embebimiento

2. **Actualizar los templates:**
   - Abre `templates/panel_*.html`
   - Reemplaza el placeholder del iframe con tu URL de Power BI
   - Asegúrate de que el src del iframe contenga tu Report ID y Workspace ID

   Ejemplo:
   ```html
   <iframe width="100%" height="600" 
       src="https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID&groupId=YOUR_GROUP_ID" 
       frameborder="0" 
       allowFullScreen="true">
   </iframe>
   ```

## 🔒 Configuración de Base de Datos en la Nube

### 🔵 Azure SQL Database (RECOMENDADO)
```
DATABASE_URL=mssql+pyodbc://usuario:contraseña@servidor.database.windows.net:1433/base_datos?driver=ODBC+Driver+17+for+SQL+Server
```

**Ver**: [AZURE_SETUP.md](./AZURE_SETUP.md) para configuración detallada

### AWS RDS (MySQL/PostgreSQL)
```
mysql+pymysql://admin:password@mydb.xxxxx.us-east-1.rds.amazonaws.com:3306/dispensadoras
```

### Google Cloud SQL
```
mysql+pymysql://user:password@35.123.45.67:3306/dispensadoras
```

### Azure Database for MySQL
```
mysql+pymysql://user@server:password@server.mysql.database.azure.com:3306/dispensadoras
```

## 📱 Rutas de la Aplicación

```
GET /              → Página de inicio
GET /paneles       → Galería de paneles
GET /panel/ventas  → Panel de ventas con Power BI
GET /panel/inventario → Panel de inventario
GET /panel/operaciones → Panel de operaciones
GET /panel/reportes → Panel de reportes consolidados
GET /acerca-de     → Página de información
```

## 🎨 Personalización

### Cambiar Colores
Edita `templates/panel_base.html` y busca las secciones CSS de colores:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    /* ... otros colores */
}
```

### Agregar Nuevos Paneles
1. Crear `templates/panel_nuevo.html`
2. Extender de `panel_base.html`
3. Agregar ruta en `app.py`
4. Actualizar lista en `paneles.html`

## 🔧 Desarrollo

### Estructura de Rutas (app.py)
```python
@app.route('/')
def index():
    return render_template('inicio.html')

@app.route('/paneles')
def paneles():
    return render_template('paneles.html')

@app.route('/panel/ventas')
def panel_ventas():
    return render_template('panel_ventas.html')
```

### Agregar Nuevas Variables de Entorno
1. Editar `.env.example`
2. Cargar en `config.py`
3. Usar en la aplicación con `os.getenv('VARIABLE_NAME')`

## 📝 Notas Importantes

- **Base de Datos**: La aplicación conecta a una base de datos en la nube pero actualmente no la utiliza directamente en las páginas de paneles
- **Power BI**: Requiere URLs de embebimiento válidas para mostrar reportes
- **Seguridad**: Cambiar `SECRET_KEY` en producción
- **HTTPS**: Recomendado usar HTTPS en producción

## 🐛 Solución de Problemas

### "Connection refused" en la BD
- Verificar que la URL de conexión es correcta
- Comprobar que el servidor de BD está accesible
- Revisar credenciales en `.env`

### Power BI no se carga
- Verificar que el Report ID y Workspace ID sean correctos
- Comprobar permisos de embebimiento en Power BI
- Revisar la consola del navegador para errores

### Errores CSS/JS
- Limpiar caché del navegador (Ctrl+Shift+Delete)
- Verificar que los archivos en `/static` estén presentes

## 📞 Soporte

Para reportar bugs o solicitar características:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

**Versión**: 2.0.0 (Simplificada para Power BI)  
**Año**: 2025  
**Estado**: Producción

