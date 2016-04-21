'use strict';

var RadioOptionsView = require('settings/RadioOptionsView'),
    Util = require('util/Util');

var _DEFAULTS = {
  classPrefix: 'checkbox-options-view',
  containerNodeName: 'ol',
  itemNodeName: 'li',
  noDataMessage: 'There is no data to display.',
  watchProperty: ''
};


/**
 * Serves as a resuable view to display configuration options. This view
 * accepts (among other things) a collection and a model on the configuration
 * options at time of construction.
 *
 * The collection provides a list of all items for the collection view to
 * render. The view listens to "add", "remove", and "reset" events on the
 * provided collection and calls the render method when such events occur.
 * The view does not listen to select/deselect on the collection...
 *
 * The model provides information regarding the currently selected values
 * for various properties. By default, this view only listens for changes to
 * the configured `options.watchProperty` property, and when that property
 * changes, the view calls its `onEvent` method.
 *
 * All messaging to/from this view should occur view events/method calls on
 * the provided model.
 *
 * Implementing sub-classes may override any public method for customized
 * behavior, however, typical extension points may involve overriding the
 * following methods:
 *
 * - deselectAll
 * - setSelected
 *
 * @param options {Object}
 *     Configuration options for this view. See documentation on the
 *     `_initialize` method for complete details on all configuration
 *     options that may be provided.
 */
var CheckboxOptionsView = function (options) {
  var _this,
      _initialize,

      _classPrefix,
      _containerNodeName,
      _watchProperty;


  _this = RadioOptionsView(options);
  options = Util.extend({}, _DEFAULTS, options);


  /**
   * Constructor.
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.collection {mvc/Collection}
   *     The collection for this view.
   * @param options.containerNodeName {String}
   *     The nodeName of the element to be created that will wrap all
   *     the items in the collection. For example: 'ul'
   * @param options.model {mvc/Model}
   *     The model for this view.
   * @param options.watchProperty {String}
   *     The name of the property on the model to watch for changes and
   *     subsequently trigger `onEvent`.
   */
  _initialize = function (options) {
    _classPrefix = options.classPrefix;
    _containerNodeName = options.containerNodeName;
    _watchProperty = options.watchProperty;
  };

  /**
   * Deselects all the items in `_this.content`. An implementing sub-class
   * may want to override this method if selection is not done by toggling
   * a "selected" class on the item element.
   *
   */
  _this.deselectAll = function () {
    Array.prototype.forEach.call(
      _this.content.querySelectorAll('input[type=checkbox]'),
      function (checkbox) {
        checkbox.checked = false;
      }
    );
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _watchProperty = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Creates and populates an element for the individual given `obj`.
   *
   * @param obj {Object}
   *     The item from the collection for which to create the element.
   *
   * @return {HTMLElement}
   *     An HTMLElement based on the configured `options.itemNodeName`
   *     property.
   */
  _this.createCollectionItemContent = function (obj) {
    var fragment,
        input,
        label;

    fragment = document.createDocumentFragment();

    input = document.createElement('input');
    input.setAttribute('id', _watchProperty + '-' + obj.id);
    input.setAttribute('name', _watchProperty);
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', obj.id);

    label = document.createElement('label');
    label.setAttribute('for', _watchProperty + '-' + obj.id);
    label.innerHTML = obj.name;

    fragment.appendChild(input);
    fragment.appendChild(label);

    return fragment;
  };

  /**
   * Method to update an element in `_this.content`, whose id
   * matches the given value "id" attribute, to appear selected.
   *
   * @param value Array<{Mixed}>
   *     Typically an array of objects with an "id" attribute which corresponds
   *     to the "id" attribute of some input in `_this.content`.
   *
   */
  _this.setSelected = function (objs) {
    var id,
        el;

    if (!objs) {
      return;
    }

    // select each checkbox
    Array.prototype.forEach.call(objs, function (obj) {
      id = obj.id;
      el = _this.content.querySelector('[data-id="' + id + '"] > input');

      if (el) {
        el.checked = true;
      }
    });
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = CheckboxOptionsView;