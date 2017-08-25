/**
 * Created by stefa on 06.03.2017.
 */
class PlussubNotificationServiceElement extends Polymer.Element {
    static get is() {
        return "notification-service";
    }

    async ready() {
        super.ready();
    }

    static get properties() {
        return {
            _placeholderMessage: {
                type: String,
                value: '<placeholder>'
            },
            _currentMessage: {
                type: String,
                value: 'intial'
            },
            duration: {
                type: Number,
                value: 3000
            }
        }
    }

    onNotify(payload) {
        this._currentMessage = payload.msg;
        this.$.toast.show();
    }

    onToastClose() {
        this._currentMessage = this._placeholderMessage;
    }
}