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

        #just copy the sqlite file.
        db_file = settings.DATABASES['default']['NAME']
        filename = os.path.basename(db_file)
        target = settings.DBBACKUP_STORAGE_OPTIONS['location']
        ret = shutil.copy(db_file, target)

        if not os.path.exists(target):
            os.makedirs(target)

        target_file = os.path.join(target, filename)
        
        if os.path.exists(target_file):
            os.remove(target_file)


        if ret != target:
            raise Exception('Failed to backup db')
