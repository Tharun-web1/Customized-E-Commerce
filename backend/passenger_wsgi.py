import os
import sys

# Directory containing this script
cwd = os.path.dirname(os.path.abspath(__file__))

# Support running directly or in a subdirectory
sys.path.insert(0, cwd)
if os.path.isdir(os.path.join(cwd, 'backend')):
    sys.path.insert(0, os.path.join(cwd, 'backend'))

# Configure Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vistaprint_backend.settings')

try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
except Exception as e:
    import traceback
    error_trace = traceback.format_exc()
    def application(environ, start_response):
        status = '500 Internal Server Error'
        output = f"Django Startup Error:\n\n{error_trace}".encode('utf-8')
        response_headers = [
            ('Content-type', 'text/plain; charset=utf-8'),
            ('Content-Length', str(len(output)))
        ]
        start_response(status, response_headers)
        return [output]
