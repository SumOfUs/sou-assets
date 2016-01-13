let ErrorDisplay = require('show_errors');

const FormMethods = {

  handleFormErrors: function() {
    this.$('form').on('ajax:error', (e, d) => { ErrorDisplay.show(e, d); });
  },

  selectizeCountry: function() {
    $('.petition-bar__country-selector').selectize();
  },

  clearFormErrors: function() {
    ErrorDisplay.clearErrors(this.$('form'));
  },

  clearForm: function(){
    let $fields_holder = this.$('.form__group--prefilled');
    $fields_holder.removeClass('form__group--prefilled');
    $fields_holder.find('input').removeAttr('value');
    $('.petition-bar__welcome-text').addClass('hidden-irrelevant');
  },

  completePrefill: function(prefillValues) {
    this.$('.petition-bar__field-container').addClass('form__group--prefilled');
    this.partialPrefill(prefillValues, []);
  },

  partialPrefill: function(prefillValues, fieldsToSkipPrefill) {
    if(typeof prefillValues !== typeof {}) { return; }
    fieldsToSkipPrefill = fieldsToSkipPrefill || [];
    this.$('.petition-bar__field-container input, select').each((ii, field) => {
      let $field = $(field);
      let name = $field.prop('name');
      if (prefillValues.hasOwnProperty(name) && fieldsToSkipPrefill.indexOf(name) === -1) {
        $field.val(prefillValues[name]);
      }
    });
  },

  formFieldCount: function() {
    return this.$('.petition-bar__field-container').length;
  },

  showFormClearer: function(member) {
    this.$().member.welcome_name
  }
};

module.exports = FormMethods;
