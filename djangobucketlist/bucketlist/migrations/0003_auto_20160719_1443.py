# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-19 13:43
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bucketlist', '0002_auto_20160718_2127'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bucketlist',
            old_name='creator',
            new_name='owner',
        ),
    ]