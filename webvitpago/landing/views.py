# pyrefly: ignore [missing-import]
from django.shortcuts import render
# pyrefly: ignore [missing-import]
from django.http import JsonResponse
# pyrefly: ignore [missing-import]
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    """
    Ruta para la página de inicio (Página 1 del PDF).
    """
    return render(request, 'landing/index.html')

def para_tu_empresa(request):
    """
    Ruta para la página 'Para tu empresa' (Página 3 del PDF).
    """
    return render(request, 'landing/para_tu_empresa.html')

def comprar_y_pagar(request):
    """
    Ruta para la página 'Comprar y pagar' / Cómo Funciona (Página 4 del PDF).
    """
    return render(request, 'landing/comprar_y_pagar.html')

def contacto(request):
    """
    Ruta para la página de Contacto (Página 5 del PDF).
    """
    return render(request, 'landing/contacto.html')

@csrf_exempt
def contact_submit(request):
    """
    Maneja el envío del formulario de contacto mediante AJAX.
    """
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST
            
            nombre = data.get('nombre', '').strip()
            telefono = data.get('telefono', '').strip()
            email = data.get('email', '').strip()
            mensaje = data.get('mensaje', '').strip()
            
            if not nombre or not telefono or not email or not mensaje:
                return JsonResponse({
                    'success': False,
                    'message': 'Por favor, rellena todos los campos requeridos.'
                }, status=400)
            
            return JsonResponse({
                'success': True,
                'message': f'¡Gracias {nombre}! Tu mensaje ha sido enviado con éxito. Nuestro equipo se pondrá en contacto contigo a la brevedad.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Ocurrió un error al procesar tu solicitud: {str(e)}'
            }, status=500)
            
    return JsonResponse({'success': False, 'message': 'Método no permitido.'}, status=405)
