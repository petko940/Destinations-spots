from django.urls import path

from apps.search.views import Search

urlpatterns = [
    path('api/search/', Search.as_view(), name='search'),
]
