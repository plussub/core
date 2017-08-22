/**
 * Created by sbreitenstein on 23/01/17.
 */
class PlussubSubtitleTimeInfoAndSettingElement extends Polymer.mixinBehaviors([tms.MetaChannelBehavior, tms.ServiceChannelBehavior, tms.ContentServiceChannelBehavior], Polymer.Element) {
    static get is() {
        return "subtitle-time-info-and-setting";
    }

    async ready() {
        tms.ServiceChannelBehavior.ready.apply(this);
        tms.MetaChannelBehavior.ready.apply(this);
        tms.ContentServiceChannelBehavior.ready.apply(this);

        srtPlayer.Redux.subscribe(()=>{
            this.onVideoTimeUpdate(srtPlayer.Redux.getState().videoMeta.tickInMs);
        });

        super.ready();
        //polymer does not like async functions, so do special stuff after call super.ready

        await this.onMetaReady();
        let [delay] = await Promise.all(Array.of(this.resolveMeta("user.play.offsetTime")));

        this.delay = Math.abs(delay);
        this._isReady = true;
    }

    static get properties() {
        return {
            delay: {
                type: Number,
                value: 0,
                observer: '_delayChanged'
            },
            selected: {
                type: String,
                value: 'ahead',
                observer: '_selectedChanged'
            },
            _isReady: {
                type: Boolean,
                value: false
            }
        }
    }

    onVideoTimeUpdate(time) {
        if (!this.$) {
            return;
        }

        const currentVideoPoint = moment.duration(time);
        this.$.current.value = this._normalize(currentVideoPoint.hours())
            + ':'
            + this._normalize(currentVideoPoint.minutes())
            + ':'
            + this._normalize(currentVideoPoint.seconds());
    }

    clear() {
        this.delay = 0;
    }

    _normalize(unit) {
        return unit < 10 ? "0" + unit : unit.toString();
    }

    _selectedChanged() {
        this._delayChanged(this.delay);
    }

    _delayChanged(newVal) {
        this.debounce('_offsetChanged', () => {
            if (!this._isReady) {
                return;
            }
            var multi = this.$.scheduling.selected === 'behind' ? 1 : -1;
            this.metaPublish({
                topic: 'user.play.offsetTime',
                data: multi * parseInt(newVal, 10)
            });
        });
    }
}
customElements.define(PlussubSubtitleTimeInfoAndSettingElement.is, PlussubSubtitleTimeInfoAndSettingElement);
