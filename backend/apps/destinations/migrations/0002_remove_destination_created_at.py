# Generated by Django 5.0.2 on 2024-03-20 20:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('destinations', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='destination',
            name='created_at',
        ),
    ]
