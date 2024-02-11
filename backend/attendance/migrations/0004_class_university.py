# Generated by Django 5.0.1 on 2024-02-11 01:15

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0003_delete_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='class',
            name='university',
            field=models.ForeignKey(default=django.utils.timezone.now, on_delete=django.db.models.deletion.CASCADE, to='attendance.university'),
            preserve_default=False,
        ),
    ]
