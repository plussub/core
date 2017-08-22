/**
 * Created by sonste on 27.12.2016.
 */
class PlussubSelectizeWrapperElement extends Polymer.Element {

    static get is() {
        return "selectize-wrapper";
    }

    ready() {
        super.ready();
        $(this.$.selectize).selectize({
            valueField: this.valueField,
            labelField: this.labelField,
            searchField: this.searchField,
            sortField: this.sortField,
            placeholder: this.placeholder,
            highlight: false,
            persist: false,
            maxOptions: this.maxOptions,
            loadThrottle: 1000,
            render: {
                option: (item) => Object.assign(document.createElement(this.renderer), {item: item})
            },
            loadingClass: 'loading',
            onChange: (data) => {
                data = data === '' ? {} : data;
                this.set('currentSelected', typeof data === 'string' ? JSON.parse(data) : data);
            },
            load: this.loadFn !== null ? this.loadFn.bind(this.parentNode) : null
        });

        this.selectize = $(this.$.selectize)[0].selectize;
        this.selectize.updatePlaceholder();
    }

    static get properties() {
        return {
            //selectize 1:1 mapping
            placeholder: {
                type: String,
                value: 'Select'
            },

            valueField: {
                type: String,
                value: ''
            },

            labelField: {
                type: String,
                value: ''
            },

            searchField: {
                type: String,
                value: ''
            },

            sortField: {
                type: Array,
                value: () => []
            },

            maxOptions: {
                type: Number,
                value: 1000
            },
            //end selecitze 1:1 mapping


            renderer: {
                type: String,
                value: ''
            },

            currentSelected: {
                type: Object,
                value: () => {
                },
                readonly: true,
                notify: true
            },

            loadFn: {
                type: Function,
                value: null
            },

            selectize: {
                type: Object,
                value: () => {
                },
            }
        }
    }


    addOption(option) {
        this.selectize.addOption(option);
    }

    addItem(item) {
        this.selectize.addItem(item);
    }

    clearOptions() {
        if (this.selectize && this.selectize.clearOptions) {
            this.selectize.clearOptions();
        }
    }

    clear(silent) {
        this.selectize.clear(silent)
    }

    clearCurrentSelection() {
        this.selectize.clear();
    }

    refreshOptions(triggerDropdown) {
        this.selectize.refreshOptions(triggerDropdown);
    }

    setValue(val, silent) {
        this.selectize.setValue(val, silent);
    }

    setTextboxValue(val) {
        this.selectize.setTextboxValue(val);
    }

    trigger(event) {
        this.selectize.trigger(event);
    }

    onSearchChange(searchValue) {
        this.selectize.setTextboxValue(searchValue);
        this.selectize.onSearchChange(searchValue);
    }

    load(values) {
        this.selectize.load((fn) => fn(values));
    }

    getOptions() {
        this.selectize.options;
    }

    getWrapped() {
        return this.selectize;
    }

}

customElements.define(PlussubSelectizeWrapperElement.is, PlussubSelectizeWrapperElement);