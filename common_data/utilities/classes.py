from django.core.paginator import Paginator
from django.views.generic.base import ContextMixin as CMixin
from formtools.wizard.views import SessionWizardView
from collections import OrderedDict
from django.http import HttpResponseRedirect
from django.utils.functional import cached_property
from math import ceil


class MultiPageDocument(CMixin):
    '''This class enables long invoices and other lists of items to be rendered correctly over multiple pages.
    Makes use of django's built in pagination feature

    '''
    page_length = 20  # default value
    first_page_length = None
    multi_page_queryset = None

    def get_multipage_queryset(self):
        '''Used to create the queryset'''

    @property
    def pages(self):
        '''Returns a list of pages'''
        pages = [self._paginator.get_page(page)
                 for page in self._paginator.page_range]

        return pages

    @property
    def page_count(self):
        return self._paginator.num_pages

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if not self.multi_page_queryset:
            self.multi_page_queryset = self.get_multipage_queryset()

        if not self.first_page_length:
            self.first_page_length = self.page_length

        self._paginator = VariableLengthPaginator(self.multi_page_queryset,
                                                  self.page_length,
                                                  first_page_length=self.first_page_length)
        context['pages'] = self.pages
        return context


class MultiPagePDFDocument(CMixin):
    '''This class enables long invoices and other lists of items to be rendered correctly over multiple pages.
    Makes use of django's built in pagination feature

    '''
    page_length = 10  # default value
    multipage_queryset = None

    @property
    def pages(self):
        '''Returns a list of pages'''
        pages = [self._paginator.get_page(page)
                 for page in self._paginator.page_range]

        return pages

    @property
    def page_count(self):
        return self._paginator.num_pages

    def get_multipage_queryset(self):
        if self.multipage_queryset:
            return self.multipage_queryset
        return None


class ConfigWizardBase(SessionWizardView):
    '''This class saves instances of each model after each step
    After all the forms are rendered, the application saves its config model'''
    config_class = None
    success_url = None

    def get_next_step(self, step=None):
        """
        Not called directly, overrides built in method that raises 
        a value error because of the condition dict
        """
        if step is None:
            step = self.steps.current

        form_list = self.get_form_list()
        keys = list(form_list.keys())

        if step in keys:
            key = keys.index(step) + 1
            if len(keys) > key:
                return keys[key]
        else:

            all_forms_keys = list(self.form_list.keys())

            if step == all_forms_keys[-1]:  # last step
                return None
            next_key = all_forms_keys.index(step) + 1
            key_string = all_forms_keys[next_key]
            key_index = keys.index(key_string)

            return keys[key_index]
            # find where it originally was in the list

        return None

    def render_next_step(self, form, **kwargs):
        '''saves each instance of the form after rendering'''
        form.save()
        return super().render_next_step(form, **kwargs)

    def render_done(self, form, **kwargs):
        '''This method overrides form tools default to prevent revalitdation
        on forms that have already been saved.'''
        final_forms = OrderedDict()
        form.save()

        # walk through the form list and try to validate the data again.
        for form_key in self.get_form_list():
            form_obj = self.get_form(
                step=form_key,
                data=self.storage.get_step_data(form_key),
                files=self.storage.get_step_files(form_key)
            )

            final_forms[form_key] = form_obj
            done_response = self.done(final_forms.values(),
                                      form_dict=final_forms, **kwargs)

            self.storage.reset()

            return done_response

    def done(self, form_list, **kwargs):
        config = self.config_class.objects.first()
        config.is_configured = True
        config.save()
        return HttpResponseRedirect(self.success_url)


class VariableLengthPaginator(Paginator):
    def __init__(self, object_list, per_page, orphans=0,
                 allow_empty_first_page=True, first_page_length=10):
        self.object_list = object_list
        self._check_object_list_is_ordered()
        self._per_page = int(per_page)
        self.orphans = int(orphans)
        self.allow_empty_first_page = allow_empty_first_page
        self.first_page_length = first_page_length

    def page(self, number):
        """Return a Page object for the given 1-based page number."""
        number = self.validate_number(number)
        self._number = number
        bottom = (number - 1) * self.per_page
        top = bottom + self.per_page
        if top + self.orphans >= self.count:
            top = self.count
        return self._get_page(self.object_list[bottom:top], number, self)

    @property
    def per_page(self):
        if self._number == 1:
            return self.first_page_length
        return self._per_page

    @cached_property
    def num_pages(self):
        """Return the total number of pages."""
        if self.count == 0 and not self.allow_empty_first_page:
            return 0
        hits = max(1, self.count - self.orphans)
        return ceil(hits / self._per_page)


# class QuickEntryMixin(object):
#     quick_entry_fields = []
#     api_url = ""
#     name = ""

#     def save(self, *args, **kwargs):
#         super().save(*args, **kwargs)
#         # check if quick entry exists if not 
#         # create new
#         # if existing update entry fields