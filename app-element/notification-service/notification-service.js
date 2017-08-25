/**
 * Created by stefa on 06.03.2017.
 */
class PlussubNotificationServiceElement extends Polymer.mixinBehaviors([tms.ServiceChannelBehavior], Polymer.Element) {
    static get is() {
        return "notification-service";
    }

    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);

        this.addEventListener("iron-overlay-closed", this.onToastClose.bind(this));
        this.serviceSubscribe({
            topic: srtPlayer.Descriptor.SERVICE.NOTIFICATION.SUB.NOTIFY,
            callback: this.onNotify.bind(this)
        });

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