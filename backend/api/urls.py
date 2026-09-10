from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('analyze/', views.analyze_resume, name='analyze_resume'),
    path('chat/', views.chat_with_context, name='chat_with_context'),
]
