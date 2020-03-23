import os
import smtplib
import ssl


context = ssl.create_default_context()

with smtplib.SMTP_SSL(
                'smtp.gmail.com',
                465,
                context=context) as server:
    server.login('kandoroc@gmail.com', '12KKa!!eb')
    resp = server.sendmail('kandoroc@gmail.com', 'kandoroc@hotmail.com', 'message')
    print(resp)