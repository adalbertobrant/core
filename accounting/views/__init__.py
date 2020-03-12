from .reports import *
from .common import *
from accounting.schedules import run_accounting_service
from background_task.models import Task


try:
    if not Task.objects.filter(task_name="accounting.schedules.run_accounting_service").exists():
        run_accounting_service(repeat=Task.DAILY)
except:
    pass
