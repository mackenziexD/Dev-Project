# Generated by Django 5.0.1 on 2024-02-11 01:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0007_remove_class_university'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='university',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='attendance.university'),
        ),
    ]
