from background_task import background
from common_data.utilities.db_util import DBBackupService


@background
def backup_db():
    DBBackupService().run()
