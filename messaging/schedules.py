from messaging.email_api.email import EmailSMTP
from messaging.models import UserProfile
from django.contrib.auth.models import User
from background_task import background
from common_data.utilities import AutomatedServiceMixin


class MessagingSyncService(AutomatedServiceMixin):
    service_name = 'messaging'

    def _run(self):
        for user in User.objects.all():
            if not UserProfile.objects.filter(user=user).exists():
                continue

                try:
                    profile = UserProfile.objects.get(user=user)
                    client = EmailSMTP(profile)
                    client.fetch_messages()

                except:
                    logger.error(
                        'The email service failed to connect to the remote server')


@background
def sync_service():
    MessagingSyncService().run()
