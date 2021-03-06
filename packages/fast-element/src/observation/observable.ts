import { Controller } from "../controller";
import { FastElement } from "../fast-element";
import { INotifier, PropertyChangeNotifier } from "./notifier";

export interface IGetterInspector {
    inspect(source: unknown, propertyName: string): void;
}

const notifierLookup = new WeakMap<any, INotifier>();
let currentInspector: IGetterInspector | undefined = void 0;

export const Observable = {
    setInspector(watcher: IGetterInspector) {
        currentInspector = watcher;
    },

    clearInspector() {
        currentInspector = void 0;
    },

    createArrayObserver(array: any[]): INotifier {
        throw new Error("Must call enableArrayObservation before observing arrays.");
    },

    getNotifier<T extends INotifier = INotifier>(source: any): T {
        let found = source.$controller || notifierLookup.get(source);

        if (found === void 0) {
            if (source instanceof FastElement) {
                found = Controller.forCustomElement(source);
            } else if (Array.isArray(source)) {
                found = Observable.createArrayObserver(source);
            } else {
                notifierLookup.set(source, (found = new PropertyChangeNotifier()));
            }
        }

        return found;
    },

    track(source: unknown, propertyName: string) {
        if (currentInspector !== void 0) {
            currentInspector.inspect(source, propertyName);
        }
    },

    notify(source: unknown, args: any) {
        Observable.getNotifier(source).notify(source, args);
    },

    define(target: {}, propertyName: string) {
        const fieldName = `_${propertyName}`;
        const callbackName = `${propertyName}Changed`;
        const hasCallback = callbackName in target;

        Reflect.defineProperty(target, propertyName, {
            enumerable: true,
            get: function(this: any) {
                Observable.track(this, propertyName);
                return this[fieldName];
            },
            set: function(this: any, value) {
                const oldValue = this[fieldName];

                if (oldValue !== value) {
                    this[fieldName] = value;

                    if (hasCallback) {
                        this[callbackName]();
                    }

                    Observable.notify(this, propertyName);
                }
            },
        });
    },
};

export function observable($target: {}, $prop: string) {
    Observable.define($target, $prop);
}
