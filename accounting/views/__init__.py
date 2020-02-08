from .reports import *
from .common import *
from accounting.schedules import run_accounting_service
from background_task.models import Task


run_accounting_service(repeat=Task.DAILY)
