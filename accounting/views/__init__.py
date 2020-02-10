from .reports import *
from .common import *
from accounting.schedules import run_accounting_service
from background_task.models import Task


try:
    run_accounting_service(repeat=Task.DAILY)
except: pass