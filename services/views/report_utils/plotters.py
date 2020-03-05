import pygal
from common_data.utilities.plotting import CustomStyle


def plot_expense_breakdown(work_order):
    chart = pygal.Pie(print_values=True, style=CustomStyle, height=400)
    for exp in work_order.expenses:
        chart.add(exp.expense.category_string, exp.expense.amount)
    total_wages = sum([log.total_cost for log in work_order.time_logs])
    chart.add('Wages', total_wages)
    for con in work_order.consumables_used:
        chart.add(con.consumable.name, con.line_value)

    return chart.render(is_unicode=True)


def plot_time_budget(work_order):
    chart = pygal.SolidGauge(inner_radius=0.7,
                             margin=0,
                             spacing=0,
                             half_pie=True,
                             style=pygal.style.styles['default'](
                                 value_font_size=72),
                             show_legend=False)

    def hr_formatter(x): return '{:.10g}Hrs'.format(x)
    chart.add('Time Budget', [{
        'value': work_order.total_time.seconds / 3600.0,
        'max_value': work_order.expected_duration.seconds / 3600.0
    }],
        formatter=hr_formatter)

    return chart.render(is_unicode=True)
