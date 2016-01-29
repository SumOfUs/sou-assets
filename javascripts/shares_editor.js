const setupOnce = require('setup_once');

(function(){

  let SharesEditor = Backbone.View.extend({

    events: {
      'ajax:success form.shares-editor__delete-variant': 'deleteVariant',
      'click .shares-editor__toggle-edit': 'toggleEditor',
      'click .shares-editor__new-type-toggle .btn': 'switchVariantForm',
      'click .shares-editor__view-toggle .btn': 'switchView',
      'ajax:success form.shares-editor__new-form': 'clearForm',
    },

    initialize: function(){
      $.subscribe('page:errors', this.openEditorForErrors());
      $.subscribe('page:saved', this.updateSummaryRows());

      // this is the kind of DOM housekeeping that makes me want to use react
      $.subscribe('image:success', this.addImageSelectors());
      $.subscribe('image:destroyed', this.pruneImageSelectors());
    },

    deleteVariant: function(e) {
      let $target = $(e.target);
      let $summary_row = $target.parents('.shares-editor__summary-row');
      let $stats_row = $summary_row.next('.share-editor__stats-row');
      let $edit_row = $stats_row.next('.shares-editor__edit-row');
      $summary_row.remove();
      $stats_row.remove();
      $edit_row.remove();
    },

    editRow: function($row) {
      if (!$row.hasClass('shares-editor__stats-row')) {
        $row = $row.next('.shares-editor__stats-row');
      }
      return $row.next('.shares-editor__edit-row');
    },

    toggleEditor: function(e) {
      let $target = this.$(e.target);
      $target = $target.is('tr') ? $target : $target.parents('tr');
      let $btn = $target.find('.shares-editor__toggle-edit');
      this.editRow($target).toggleClass('hidden-closed');
      $btn.text( $btn.text() == "Edit" ? "Done" : "Edit" );
    },

    openEditor: function($edit_row){
      let $prev = $edit_row.prev('.shares-editor__summary-row');
      let $btn = $prev.find('.shares-editor__toggle-edit');
      $btn.text( "Done" );
      $edit_row.removeClass('hidden-closed');
    },

    switchVariantForm: function(e){
      let $target = this.$(e.target)
      const desired = $target.data('state');
      if (desired) {
        this.$('.shares-editor__new-type-toggle .btn').removeClass('btn-primary');
        $target.addClass('btn-primary');
        this.$('.shares-editor__new-form').addClass('hidden-closed');
        this.$(`.shares-editor__new-form[data-share="${desired}"]`).removeClass('hidden-closed');
      }
    },

    switchView: function(e) {
      let $target = this.$(e.target)
      const desired = $target.data('state');
      if (desired) {
        this.$('.shares-editor__view-toggle .btn').removeClass('btn-primary');
        $target.addClass('btn-primary');
        if (desired === 'summary') {
          this.$('.shares-editor__summary-row').removeClass('hidden-closed');
          this.$('.shares-editor__stats-row').addClass('hidden-closed');
          this.$('.shares-editor__stats-heading').addClass('hidden-closed');
        } else {
          this.$('.shares-editor__summary-row').addClass('hidden-closed');
          this.$('.shares-editor__stats-row').removeClass('hidden-closed');
          this.$('.shares-editor__stats-heading').removeClass('hidden-closed');
        }
      }
    },

    clearForm: function(e){
      $(e.target).find('input[type="text"], textarea').val('')
    },

    openEditorForErrors: function(){
      return () => { // closure for this in callback
        this.openEditor(this.$('.has-error').parents('.shares-editor__edit-row'));
      }
    },

    updateSummaryRows: function(){
      // this only updates existing shares. new ones are appended by
      // code in view/share/shares/create.js.erb, using rails UJS
      return (e, data) => { // closure for `this` in callback
        $.get(`/api/pages/${data.id}/share-rows`, (rows) => {
          _.each(rows, (row) => {
            let $row = $(row.html);
            $row = $(`#${$row.prop('id')}`).replaceWith($row);
            $row = $(`#${$row.prop('id')}`);
            if (!this.editRow($row).hasClass('hidden-closed')) {
              $row.find('.shares-editor__toggle-edit').text('Done');
            }
          })
        });
      }
    },

    addImageSelectors: function(){
      return (e, file, id, html) => { // closure for `this` in callback
        let newOption = `<option value='${id}'>${file.name}</option>`;
        this.$('.shares-editor__image-selector').append(newOption);
      }
    },

    pruneImageSelectors: function(){
      return (e, id) => { // closure for `this` in callback
        this.$(`option[value="${id}"]`).remove()
      }
    },

  });

  $.subscribe("shares:edit", function(){
    setupOnce('.shares-editor', SharesEditor);
  });
}());
