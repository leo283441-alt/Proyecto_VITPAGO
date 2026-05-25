# pyrefly: ignore [missing-import]
from django.urls import path
# pyrefly: ignore [missing-import]
from . import views

app_name = 'landing'

urlpatterns = [
    path('', views.index, name='index'),
    path('para-tu-empresa/', views.para_tu_empresa, name='para_tu_empresa'),
    path('comprar-y-pagar/', views.comprar_y_pagar, name='comprar_y_pagar'),
    path('contacto/', views.contacto, name='contacto'),
    path('contact-submit/', views.contact_submit, name='contact_submit'),
]
