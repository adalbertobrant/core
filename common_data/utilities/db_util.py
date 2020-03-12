from common_data.utilities import AutomatedServiceMixin
from common_data.models import GlobalConfig
import subprocess
import os
from latrom import settings
import datetime
import shutil


class DBBackupService(AutomatedServiceMixin):
    service_name = 'common'

    @property
    def should_backup_db(self):
        config = GlobalConfig.objects.first()
        if not config.use_backups:
            return False
        now = datetime.datetime.now()
        return (now - config.last_automated_service_run).total_seconds() \
            >= config.task_mapping

    def _run(self):
        if not self.should_backup_db:
            return

        os.chdir(settings.BASE_DIR)
        ret = subprocess.run('python manage.py dumpdata auth employees invoicing inventory planner services accounting common_data messaging --e=auth.permission --e=contenttypes -o data.json')
        if ret.returncode != 0:
            raise Exception('Failed to backup db')

        print('made backup')
        temp = os.path.join('database', 'temp')
        if not os.path.exists(temp):
            os.makedirs(temp)

        shutil.copy('data.json', temp)
        filename = 'bkup_' + datetime.datetime.now().strftime('%Y%m%d%H%M')
        shutil.make_archive(filename, 'zip', temp)
        shutil.rmtree(temp)
        os.remove('data.json')
        shutil.copy(filename + '.zip', 'database/')
