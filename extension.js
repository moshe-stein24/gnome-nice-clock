import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const CLOCK_SIZE = 24;
const FACE_WIDTH = 2;
const ARM_WIDTH = 1.75;
const UPDATE_INTERVAL = 500;

class AnalogClockWidget {
    constructor() {
        this._displayTime = [0, 0];
        
        this._analog_clock = new St.DrawingArea({
            style_class: 'nice-clock-widget',
            width: CLOCK_SIZE,
            height: CLOCK_SIZE,
        });
        
        this._repaintHandler = this._analog_clock.connect('repaint', () => {
            this._paintClock();
        });
        
        this._updateTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, UPDATE_INTERVAL, () => {
            this._onTimeout();
            return GLib.SOURCE_CONTINUE;
        });
        
        this._onTimeout();
    }
    
    get actor() {
        return this._analog_clock;
    }
    
    _onTimeout() {
        const now = new Date();
        const displayTime = [now.getHours(), now.getMinutes()];
        
        if ((this._displayTime[0] !== displayTime[0]) || (this._displayTime[1] !== displayTime[1])) {
            this._displayTime = displayTime;
            this._analog_clock.queue_repaint();
        }
        
        return GLib.SOURCE_CONTINUE;
    }
    
    _paintClock() {
        const cr = this._analog_clock.get_context();
        
        let h = this._displayTime[0];
        if (h > 12) h -= 12;
        const m = this._displayTime[1];
        
        const areaWidth = this._analog_clock.get_width();
        const areaHeight = this._analog_clock.get_height();
        
        // Explicitly set white color (IMPORTANT!)
        cr.setSourceRGBA(1, 1, 1, 0.9);
        
        // Move to center
        cr.translate(areaWidth / 2.0, areaHeight / 2.0);
        
        // Draw face circle
        cr.setLineWidth(FACE_WIDTH);
        cr.arc(0, 0, areaHeight / 2.25 - FACE_WIDTH, 0, 2 * Math.PI);
        cr.stroke();
        
        cr.save();
        cr.setLineWidth(ARM_WIDTH);
        
        // Draw hour hand
        cr.save();
        cr.rotate(((h + (m / 60.0)) / 12.0) * 2 * Math.PI);
        cr.moveTo(0, 0);
        cr.lineTo(0, -0.195 * areaHeight);
        cr.stroke();
        cr.restore();
        
        // Draw minute hand
        cr.save();
        cr.rotate((m / 60.0) * 2 * Math.PI);
        cr.moveTo(0, 0);
        cr.lineTo(0, -0.25 * areaHeight);
        cr.stroke();
        cr.restore();
        
        cr.restore();
    }
    
    destroy() {
        if (this._repaintHandler) {
            this._analog_clock.disconnect(this._repaintHandler);
        }
        if (this._updateTimer) {
            GLib.source_remove(this._updateTimer);
        }
        if (this._analog_clock) {
            this._analog_clock.destroy();
        }
    }
}

export default class NiceClockExtension extends Extension {
    enable() {
        this._clock = new AnalogClockWidget();
        
        // Wrap in a container with padding
        const container = new St.Bin({
            child: this._clock.actor,
            style_class: 'clock-container',
        });
        
        // Add directly to the right box
        Main.panel._rightBox.insert_child_at_index(container, 0);
        this._container = container;
    }
    
    disable() {
        if (this._container) {
            this._container.destroy();
            this._container = null;
        }
        if (this._clock) {
            this._clock.destroy();
            this._clock = null;
        }
    }
}